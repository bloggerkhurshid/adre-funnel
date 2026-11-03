import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc,
  deleteDoc,
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';

// User's Official Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeNXGiKX4F7ouT-r2pbJb2Fn_WqKNVkrQ",
  authDomain: "projuktisoft-shop.firebaseapp.com",
  projectId: "projuktisoft-shop",
  storageBucket: "projuktisoft-shop.firebasestorage.app",
  messagingSenderId: "624960217618",
  appId: "1:624960217618:web:bdd5c3a8b03c892830aecb",
  measurementId: "G-ZV3VZQBLRJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Save confirmed order to Firestore
 */
export async function saveOrderToFirestore(orderData) {
  try {
    const cleanPhone = (orderData.phone || '').replace(/\D/g, '').slice(-10);
    const cleanEmail = (orderData.email || '').trim().toLowerCase();

    const docRef = await addDoc(collection(db, 'orders'), {
      name: orderData.name || 'Valued Learner',
      email: cleanEmail,
      phone: cleanPhone,
      productId: orderData.product?.id || 'adre-combo',
      productName: orderData.product?.name || 'Assam Govt Exam 4-in-1 MCQ Combo',
      orderBumpSelected: !!orderData.orderBumpSelected,
      orderBumpName: orderData.orderBumpSelected ? (orderData.orderBump?.name || 'CTET Paper I & II MCQ Ebook') : null,
      totalAmount: Number(orderData.totalAmount || orderData.product?.price || 99),
      paymentId: orderData.paymentId || `pay_${Date.now()}`,
      gateway: orderData.gateway || 'cashfree',
      createdAtISO: new Date().toISOString(),
      createdAt: serverTimestamp()
    });

    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
    return { success: false, error };
  }
}

/**
 * Search orders by customer email OR WhatsApp phone number
 */
export async function findOrdersByEmailOrPhone(queryInput) {
  if (!queryInput) return [];
  const trimmed = queryInput.trim().toLowerCase();
  const digitsOnly = queryInput.replace(/\D/g, '').slice(-10);

  const ordersRef = collection(db, 'orders');
  const matchedOrders = new Map();

  try {
    // 1. Search by email
    if (trimmed.includes('@')) {
      const qEmail = query(ordersRef, where('email', '==', trimmed));
      const emailSnap = await getDocs(qEmail);
      emailSnap.forEach(doc => matchedOrders.set(doc.id, { id: doc.id, ...doc.data() }));
    }

    // 2. Search by phone
    if (digitsOnly.length === 10) {
      const qPhone = query(ordersRef, where('phone', '==', digitsOnly));
      const phoneSnap = await getDocs(qPhone);
      phoneSnap.forEach(doc => matchedOrders.set(doc.id, { id: doc.id, ...doc.data() }));
    }

    // If query could be both
    if (!trimmed.includes('@') && digitsOnly.length < 10) {
      // Partial match not supported in basic Firestore query, return matched
    }

    return Array.from(matchedOrders.values());
  } catch (error) {
    console.error('Error searching orders in Firestore:', error);
    return [];
  }
}

/**
 * Get all orders for Admin Dashboard
 */
export async function fetchAllOrdersForAdmin() {
  try {
    const ordersRef = collection(db, 'orders');
    // Fetch all orders
    const querySnapshot = await getDocs(ordersRef);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    // Sort client-side by date descending
    orders.sort((a, b) => {
      const timeA = new Date(a.createdAtISO || 0).getTime();
      const timeB = new Date(b.createdAtISO || 0).getTime();
      return timeB - timeA;
    });

    return orders;
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return [];
  }
}

/**
 * Delete a single order from Firestore
 */
export async function deleteOrderFromFirestore(orderId) {
  if (!orderId) return { success: false, error: 'No orderId provided' };
  try {
    const docRef = doc(db, 'orders', orderId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting order ${orderId}:`, error);
    return { success: false, error };
  }
}

/**
 * Bulk delete multiple orders from Firestore
 */
export async function deleteOrdersBulkFromFirestore(orderIds = []) {
  if (!orderIds || orderIds.length === 0) return { success: true, count: 0 };
  
  try {
    // Try batch delete first
    const batch = writeBatch(db);
    orderIds.forEach((id) => {
      const docRef = doc(db, 'orders', id);
      batch.delete(docRef);
    });
    await batch.commit();
    return { success: true, count: orderIds.length };
  } catch (batchErr) {
    console.warn('Batch delete failed, falling back to Promise.all individual deletes:', batchErr);
    try {
      await Promise.all(
        orderIds.map((id) => deleteDoc(doc(db, 'orders', id)))
      );
      return { success: true, count: orderIds.length };
    } catch (fallbackErr) {
      console.error('Bulk delete fallback error:', fallbackErr);
      return { success: false, error: fallbackErr };
    }
  }
}

