// আপনার রেন্ডার সার্ভারের লিংক
const API_URL = "https://gscbncc-api.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
    // 1. আইকন চালু করা
    lucide.createIcons();

    // 2. ইউজার লগিন করা আছে কিনা চেক করা
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
        window.location.href = "/gscbncc/login/";
        return;
    }

    const user = JSON.parse(storedUser);
    
    // 3. সার্ভার থেকে লেটেস্ট ডাটা আনা (যাতে আপডেট সাথে সাথে দেখা যায়)
    await refreshUserData(user.memberId);
});

async function refreshUserData(memberId) {
    try {
        const res = await fetch(`${API_URL}/api/members`);
        const members = await res.json();
        const currentUser = members.find(m => m.memberId === memberId);

        if (currentUser) {
            // UI আপডেট করা
            updateUI(currentUser);
            // লোকাল স্টোরেজ আপডেট করা
            localStorage.setItem("user", JSON.stringify(currentUser));
        }
    } catch (err) {
        console.error("Failed to fetch fresh data");
        // সার্ভার অফ থাকলে লোকাল ডাটা দিয়ে চালানো
        const user = JSON.parse(localStorage.getItem("user"));
        updateUI(user);
    }
}

function updateUI(user) {
    document.getElementById("welcomeName").innerText = user.name;
    document.getElementById("displayId").innerText = user.memberId;
    document.getElementById("displayRank").innerText = user.rank;
    
    // ছবি না থাকলে ডিফল্ট ছবি
    const imgUrl = user.imageUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`;
    document.getElementById("profileImage").src = imgUrl;

    // Stats
    // যেহেতু সার্ভারে প্যারেড লজিক একটু ভিন্ন হতে পারে, আমরা সিম্পল রাখছি:
    // (নোট: আপনার সার্ভার কোডে totalParades ডায়নামিক করা হয়নি, তাই এটা পরে আপডেট করতে হবে)
    // আপাতত আমরা attendedParades দেখাচ্ছি
    document.getElementById("statAttended").innerText = user.attendedParades || 0;
    
    // ফর্ম ফিলাপ করা
    document.getElementById("editPhone").value = user.phone || "";
    document.getElementById("editBlood").value = user.bloodGroup || "";
    document.getElementById("editImage").value = user.imageUrl || "";
}

// প্রোফাইল আপডেট ফাংশন
document.getElementById("updateForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    
    const phone = document.getElementById("editPhone").value;
    const bloodGroup = document.getElementById("editBlood").value;
    const imageUrl = document.getElementById("editImage").value;
    const password = document.getElementById("editPassword").value;

    const updateData = { phone, bloodGroup, imageUrl };
    if (password) updateData.password = password;

    try {
        const res = await fetch(`${API_URL}/api/profile/${user.memberId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        const result = await res.json();

        if (result.success) {
            alert("Profile Updated Successfully!");
            refreshUserData(user.memberId); // পেজ রিফ্রেশ না করে ডাটা আপডেট
        } else {
            alert("Failed: " + result.message);
        }
    } catch (err) {
        alert("Server Error!");
    }
});

// অনলাইন হাজিরা (Present) ফাংশন
async function markAttendance() {
    const user = JSON.parse(localStorage.getItem("user"));
    const today = new Date();
    // তারিখ ফরম্যাট: DD-MM-YYYY
    const dateStr = `${today.getDate()}-${today.toLocaleString('default', { month: 'short' })}-${today.getFullYear()}`; 
    
    if(!confirm(`Mark attendance for today (${dateStr})?`)) return;

    try {
        const res = await fetch(`${API_URL}/api/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                memberId: user.memberId, 
                date: dateStr, // যেমন: 2-Dec-2025
                type: "Regular Parade" // ডিফল্ট টাইপ
            })
        });
        const result = await res.json();
        
        if(result.success) {
            alert("Hooray! Attendance Marked! 🎉");
            refreshUserData(user.memberId);
        } else {
            alert(result.message); // যেমন: "Already Present"
        }
    } catch (err) {
        alert("Server Error! Could not mark attendance.");
    }
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "/gscbncc/login/";
}