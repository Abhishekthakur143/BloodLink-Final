const { getCompatibleDonors } = require('../utils/bloodCompatibility');

// AI Blood Match Recommendation
exports.bloodMatchRecommendation = async (req, res) => {
  try {
    const { bloodGroup } = req.query;
    if (!bloodGroup) return res.status(400).json({ error: 'Blood group is required' });

    const compatibleGroups = getCompatibleDonors(bloodGroup);
    
    let recommendation = `For ${bloodGroup}, compatible donors are: ${compatibleGroups.join(', ')}.`;
    if (compatibleGroups.includes('O-')) {
      recommendation += ' O- (Universal Donor) is highly recommended in critical shortages!';
    }

    res.status(200).json({ success: true, compatibleDonorGroups: compatibleGroups, recommendation: recommendation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// AI Chatbot
exports.aiChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    let reply = "I am sorry, I didn't understand that. I can help with blood eligibility, compatibility, and SOS.";

    const msg = message.toLowerCase();

    if (msg.includes('eligib') || msg.includes('donate')) {
      reply = "To donate blood, you must be 18-65 years old, weigh at least 50kg, and not have donated in the last 90 days. Pregnant women and people with recent tattoos (within 6 months) are deferred.";
    } else if (msg.includes('o negative') || msg.includes('universal')) {
      reply = "O negative (O-) is the universal donor blood type. It can be given to patients of any blood type in emergencies!";
    } else if (msg.includes('camp') || msg.includes('drive')) {
      reply = "You can find upcoming blood donation camps on the 'Camps' page. You can register and book a slot for any upcoming camp near you.";
    } else if (msg.includes('hello') || msg.includes('hi')) {
      reply = "Hello! I am BloodLink AI Assistant. How can I help you today? You can ask about blood eligibility or compatibility.";
    }

    res.status(200).json({ success: true, reply: reply });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};