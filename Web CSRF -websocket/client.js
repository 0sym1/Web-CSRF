const form = document.getElementById('statusForm');
const statusContainer = document.getElementById('statusContainer');
const socket = io();

// Check if a username is stored in the cookie and pre-fill the username field
document.addEventListener('DOMContentLoaded', function() {
  const storedUsername = getCookie("username");
  if (storedUsername) {
      document.getElementById('username').value = storedUsername;
      alert("Welcome back, " + storedUsername + "!");
  }
});

// Hàm để mã hóa ký tự đặc biệt (bảo vệ XSS)
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        console.error("Expected a string, but received:", unsafe);
        return ""; // Trả về chuỗi rỗng hoặc giá trị mặc định nếu không phải là chuỗi
    }
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Hàm để phát hiện URL và chuyển đổi thành thẻ <a>
function formatLinks(text) {
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlPattern, function(url) {
        return `<a href="${url}" target="_blank">${url}</a>`;
    });
}

// Function to generate a random string for the cookie
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Set a cookie with a random string
function setCookie(name, value, days) {
  
  document.cookie = value;
}

// Get the cookie value by its name
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Store username-cookie mapping in localStorage
function saveUsernameForCookie(cookie, username) {
  const userMap = JSON.parse(localStorage.getItem('userMap')) || {};
  userMap[cookie] = username;
  localStorage.setItem('userMap', JSON.stringify(userMap));
}

// Get the username based on the cookie value
function getUsernameForCookie(cookie) {
  const userMap = JSON.parse(localStorage.getItem('userMap')) || {};
  return userMap[cookie];
}

// Check if a user is already logged in
document.addEventListener('DOMContentLoaded', function () {
  const cookie = getCookie("userSession");
  if (cookie) {
      const username = getUsernameForCookie(cookie);
      if (username) {
          document.getElementById('username').value = username;
          alert("Welcome back, " + username + "!");
      }
  }
});

form.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent page reload
  

  const username = document.getElementById('username').value;
  const status = document.getElementById('status').value;
  
  socket.emit("newStatus",{username: username, message:status});

  // Check if the user already has a cookie
  let cookie = getCookie("userSession");
  if (!cookie) {
      // If no cookie, generate a new one and save it
      cookie = generateRandomString(16); // Generate a random 16 character string
      setCookie("userSession", cookie, 30); // Store for 30 days
  }

  // Save the username associated with the cookie
  saveUsernameForCookie(cookie, username);

  // Create and display the new status
//   const newStatus = document.createElement('div');
//   newStatus.classList.add('status-item');
//   const formattedStatus = formatLinks(escapeHtml(status));

//   let statusContent = `<strong>${escapeHtml(username)}:</strong> ${formattedStatus}`;
//   newStatus.innerHTML = statusContent;
//   statusContainer.appendChild(newStatus);
  
   // Insert the new status at the top of the status container
    // const firstStatus = statusContainer.firstChild;
    // statusContainer.insertBefore(newStatus, firstStatus);


  // Only reset the status field, keep the username
  console.log("clear");
  document.getElementById('status').value = '';
  
  return false;
});

////////////////////////////////////////////////////

// Khởi tạo kết nối với server qua Socket.IO


// Lắng nghe sự kiện 'newStatus' từ server và cập nhật UI
socket.on('newStatus', (statusData) => {
  console.log("new");
  
    const newStatus = document.createElement('div');
    newStatus.classList.add('status-item');
    const formattedStatus = formatLinks(escapeHtml(statusData.message));
  

    let statusContent = `<strong>${escapeHtml(statusData.username)}:</strong> ${formattedStatus}`;
    newStatus.innerHTML = statusContent;
  
    // Thêm status mới lên đầu danh sách
    const firstStatus = statusContainer.firstChild;
    statusContainer.insertBefore(newStatus, firstStatus);
});

// Tải các status hiện có khi người dùng kết nối
socket.on('connection', (statuses) => {
  console.log("load");
  
    statuses.forEach(statusData => {
        const newStatus = document.createElement('div');
        newStatus.classList.add('status-item');
        const formattedStatus = formatLinks(escapeHtml(statusData.status));

        let statusContent = `<strong>${escapeHtml(statusData.username)}:</strong> ${formattedStatus}`;
        newStatus.innerHTML = statusContent;

        // Thêm các status cũ lên đầu danh sách
        const firstStatus = statusContainer.firstChild;
        statusContainer.insertBefore(newStatus, firstStatus);
    });
});
