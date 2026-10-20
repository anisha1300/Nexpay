import { db } from '../firebase';
import { 
  collection, addDoc, query, where, orderBy, 
  getDocs, serverTimestamp, doc, getDoc, runTransaction, updateDoc, increment 
} from 'firebase/firestore';

export const recordTransaction = async (senderId, receiverName, receiverId, amount, type) => {
  const senderRef = doc(db, "users", senderId);
  const receiverRef = doc(db, "users", receiverId);
  const amountNum = parseFloat(amount);

  if (isNaN(amountNum) || amountNum <= 0) {
    throw new Error("Invalid payment amount");
  }

  try {
    await runTransaction(db, async (transaction) => {
      const senderDoc = await transaction.get(senderRef);
      if (!senderDoc.exists()) throw new Error("Sender account not found");

      const senderBalance = senderDoc.data().balance || 0;
      if (senderBalance < amountNum) {
        throw new Error("Insufficient Balance in your wallet");
      }

      transaction.update(senderRef, { 
        balance: senderBalance - amountNum 
      });

      if (type === 'INTERNAL') {
        const receiverDoc = await transaction.get(receiverRef);
        if (receiverDoc.exists()) {
          const receiverBalance = receiverDoc.data().balance || 0;
          transaction.update(receiverRef, { 
            balance: receiverBalance + amountNum 
          });
        }
      }
    });

    await addDoc(collection(db, "transactions"), {
      userId: senderId,
      receiverId: receiverId,
      merchantName: receiverName,
      amount: amountNum,
      timestamp: serverTimestamp(),
      type: 'debit',
      paymentType: type,
      status: 'success'
    });

    return true;
  } catch (error) {
    console.error("Transaction Execution Failed:", error);
    throw error;
  }
};

export const processPayment = async (userId, amount) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("Your wallet is not initialized. Please add balance first.");
  }

  const currentBalance = userSnap.data().balance || 0;
  if (currentBalance < amount) {
    throw new Error("Insufficient Balance");
  }

  await updateDoc(userRef, {
    balance: increment(-amount)
  });
  
  return currentBalance - amount;
};

/* GET TRANSACTION HISTORY */
export const getTransactionHistory = async (userId) => {
  try {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc") 
    );
    const querySnapshot = await getDocs(q);
    const history = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });
    return history;
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};

/* GET USER BALANCE */
export const getUserBalance = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? (userSnap.data().balance || 0) : 0;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
};