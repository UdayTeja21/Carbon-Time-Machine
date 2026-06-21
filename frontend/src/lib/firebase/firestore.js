import { db } from "./config";
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from "firebase/firestore";

export const logActivity = async (userId, activityType, co2Impact, points, details = "") => {
  if (!userId) return;

  try {
    const activitiesRef = collection(db, "user_activities");
    await addDoc(activitiesRef, {
      userId,
      activityType,
      co2Impact: Number(co2Impact) || 0,
      points: Number(points) || 0,
      details,
      timestamp: Timestamp.now(),
    });
    console.log("Activity logged successfully.");
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

export const getUserDashboardStats = async (userId) => {
  if (!userId) return null;

  try {
    const activitiesRef = collection(db, "user_activities");
    // Fetch last 30 days of activity for trends
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const q = query(
      activitiesRef,
      where("userId", "==", userId),
      where("timestamp", ">=", Timestamp.fromDate(thirtyDaysAgo)),
      orderBy("timestamp", "asc")
    );

    const snapshot = await getDocs(q);
    
    let totalScore = 0;
    let totalEmissions = 0; // CO2 impact (negative is good, positive is bad)
    const recentActivities = [];
    
    // Day of week trends
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const emissionsByDay = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 };

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalScore += data.points || 0;
      totalEmissions += data.co2Impact || 0;
      
      const date = data.timestamp.toDate();
      const dayName = days[date.getDay()];
      emissionsByDay[dayName] += data.co2Impact || 0;

      recentActivities.push(data);
    });

    const weeklyData = days.map(day => ({
      name: day,
      emissions: Number(emissionsByDay[day].toFixed(1))
    }));

    // If there's barely any data, seed some baseline so the chart isn't empty
    if (recentActivities.length < 3) {
       // Seed empty data with a baseline or leave it real? 
       // The user wanted real, but if it's completely empty, maybe keep it 0.
    }

    return {
      totalScore: Math.max(0, totalScore),
      totalEmissions: Number(totalEmissions.toFixed(1)),
      weeklyData,
      activitiesCount: recentActivities.length
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
};
