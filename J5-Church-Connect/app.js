// ============================================
// CYBERLYNX SYSTEM - CORE FUNCTIONALITY
// ============================================

// Toggle sidebar visibility on mobile
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const adminLayout = document.querySelector('.admin-layout');
  
  if (sidebar) {
    sidebar.classList.toggle('active');
  }
  
  if (adminLayout) {
    adminLayout.classList.toggle('mobile-menu-open');
  }
}

// ============================================
// DATA MANAGEMENT - LocalStorage
// ============================================

const DataStore = {
  // Initialize data
  init() {
    if (!localStorage.getItem('cyberlynxData')) {
      localStorage.setItem('cyberlynxData', JSON.stringify({
        users: [
          { id: 1, name: 'Admin User', role: 'Super Administrator', status: 'Active', lastLogin: 'Today' },
          { id: 2, name: 'Pastor John', role: 'Pastor', department: 'Pastoral Care', status: 'Active' },
          { id: 3, name: 'Media Team Member', role: 'Social Media Manager', department: 'Media Ministry', status: 'Active' }
        ],
        branches: [
          { id: 1, name: 'Mvuma Holy Land Main Branch', location: 'Midlands, Zimbabwe', pastor: 'Bishop Andby Makururu', members: 4500, attendance: 1200 },
          { id: 2, name: 'International Branch', location: 'Coming Soon', pastor: 'Not Assigned', members: 0 }
        ],
        events: [
          { id: 1, name: 'Sunday Worship Service', date: '23 August 2026', time: '09:00 AM', location: 'Main Sanctuary', ministry: 'General Worship', registration: 'Open' },
          { id: 2, name: 'Youth Conference', date: '05 September 2026', time: '10:00 AM', location: 'Church Grounds', ministry: 'Youth Ministry', registration: 'Open' }
        ],
        giving: [
          { id: 1, name: 'John Member', memberId: 'J5-001', type: 'Tithe', amount: '$500', status: 'Received' },
          { id: 2, name: 'Mary Member', memberId: 'J5-002', type: 'Offering', amount: '$100', status: 'Received' }
        ]
      }));
    }
  },

  // Get all data
  getData() {
    return JSON.parse(localStorage.getItem('cyberlynxData')) || {};
  },

  // Save data
  saveData(data) {
    localStorage.setItem('cyberlynxData', JSON.stringify(data));
  },

  // Add new item
  addItem(collection, item) {
    const data = this.getData();
    if (!data[collection]) data[collection] = [];
    item.id = Math.max(...data[collection].map(i => i.id), 0) + 1;
    data[collection].push(item);
    this.saveData(data);
    return item;
  },

  // Update item
  updateItem(collection, id, updates) {
    const data = this.getData();
    const index = data[collection].findIndex(i => i.id === id);
    if (index !== -1) {
      data[collection][index] = { ...data[collection][index], ...updates };
      this.saveData(data);
    }
  },

  // Delete item
  deleteItem(collection, id) {
    const data = this.getData();
    data[collection] = data[collection].filter(i => i.id !== id);
    this.saveData(data);
  },

  // Get items by collection
  getItems(collection) {
    const data = this.getData();
    return data[collection] || [];
  }
};

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
    event.target.classList.remove('active');
  }
});

// ============================================
// USER MANAGEMENT FUNCTIONS
// ============================================

function openManageUserModal(userId) {
  const users = DataStore.getItems('users');
  const user = users.find(u => u.id === userId);
  
  if (user) {
    document.getElementById('userNameInput').value = user.name;
    document.getElementById('userRoleInput').value = user.role;
    document.getElementById('editUserId').value = userId;
    openModal('userModal');
  }
}

function saveUser() {
  const userId = parseInt(document.getElementById('editUserId').value);
  const name = document.getElementById('userNameInput').value;
  const role = document.getElementById('userRoleInput').value;
  
  if (name && role) {
    if (userId) {
      DataStore.updateItem('users', userId, { name, role });
    } else {
      DataStore.addItem('users', { name, role, status: 'Active' });
    }
    closeModal('userModal');
    location.reload();
  }
}

function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    DataStore.deleteItem('users', userId);
    location.reload();
  }
}

function createNewUser() {
  document.getElementById('editUserId').value = '';
  document.getElementById('userNameInput').value = '';
  document.getElementById('userRoleInput').value = '';
  openModal('userModal');
}

// ============================================
// BRANCH MANAGEMENT FUNCTIONS
// ============================================

function openManageBranchModal(branchId) {
  const branches = DataStore.getItems('branches');
  const branch = branches.find(b => b.id === branchId);
  
  if (branch) {
    document.getElementById('branchNameInput').value = branch.name;
    document.getElementById('branchLocationInput').value = branch.location;
    document.getElementById('branchPastorInput').value = branch.pastor;
    document.getElementById('editBranchId').value = branchId;
    openModal('branchModal');
  }
}

function saveBranch() {
  const branchId = parseInt(document.getElementById('editBranchId').value);
  const name = document.getElementById('branchNameInput').value;
  const location = document.getElementById('branchLocationInput').value;
  const pastor = document.getElementById('branchPastorInput').value;
  
  if (name && location && pastor) {
    if (branchId) {
      DataStore.updateItem('branches', branchId, { name, location, pastor });
    } else {
      DataStore.addItem('branches', { name, location, pastor, members: 0, attendance: 0 });
    }
    closeModal('branchModal');
    location.reload();
  }
}

function deleteBranch(branchId) {
  if (confirm('Are you sure you want to delete this branch?')) {
    DataStore.deleteItem('branches', branchId);
    location.reload();
  }
}

function createNewBranch() {
  document.getElementById('editBranchId').value = '';
  document.getElementById('branchNameInput').value = '';
  document.getElementById('branchLocationInput').value = '';
  document.getElementById('branchPastorInput').value = '';
  openModal('branchModal');
}

// ============================================
// EVENT MANAGEMENT FUNCTIONS
// ============================================

function openManageEventModal(eventId) {
  const events = DataStore.getItems('events');
  const event = events.find(e => e.id === eventId);
  
  if (event) {
    document.getElementById('eventNameInput').value = event.name;
    document.getElementById('eventDateInput').value = event.date;
    document.getElementById('eventLocationInput').value = event.location;
    document.getElementById('editEventId').value = eventId;
    openModal('eventModal');
  }
}

function saveEvent() {
  const eventId = parseInt(document.getElementById('editEventId').value);
  const name = document.getElementById('eventNameInput').value;
  const date = document.getElementById('eventDateInput').value;
  const location = document.getElementById('eventLocationInput').value;
  
  if (name && date && location) {
    if (eventId) {
      DataStore.updateItem('events', eventId, { name, date, location });
    } else {
      DataStore.addItem('events', { name, date, location, time: 'TBD', ministry: 'General', registration: 'Open' });
    }
    closeModal('eventModal');
    location.reload();
  }
}

function deleteEvent(eventId) {
  if (confirm('Are you sure you want to delete this event?')) {
    DataStore.deleteItem('events', eventId);
    location.reload();
  }
}

function createNewEvent() {
  document.getElementById('editEventId').value = '';
  document.getElementById('eventNameInput').value = '';
  document.getElementById('eventDateInput').value = '';
  document.getElementById('eventLocationInput').value = '';
  openModal('eventModal');
}

// ============================================
// GIVING MANAGEMENT FUNCTIONS
// ============================================

function openManageGivingModal(givingId) {
  const giving = DataStore.getItems('giving');
  const record = giving.find(g => g.id === givingId);
  
  if (record) {
    document.getElementById('givingNameInput').value = record.name;
    document.getElementById('givingAmountInput').value = record.amount;
    document.getElementById('givingTypeInput').value = record.type;
    document.getElementById('editGivingId').value = givingId;
    openModal('givingModal');
  }
}

function saveGiving() {
  const givingId = parseInt(document.getElementById('editGivingId').value);
  const name = document.getElementById('givingNameInput').value;
  const amount = document.getElementById('givingAmountInput').value;
  const type = document.getElementById('givingTypeInput').value;
  
  if (name && amount && type) {
    if (givingId) {
      DataStore.updateItem('giving', givingId, { name, amount, type });
    } else {
      DataStore.addItem('giving', { name, amount, type, memberId: 'J5-NEW', status: 'Pending' });
    }
    closeModal('givingModal');
    location.reload();
  }
}

function deleteGiving(givingId) {
  if (confirm('Are you sure you want to delete this record?')) {
    DataStore.deleteItem('giving', givingId);
    location.reload();
  }
}

// ============================================
// NAVIGATION - Make Static Cards Clickable
// ============================================

function navigateToPage(page) {
  window.location.href = page + '.html';
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize data store
  DataStore.init();
  
  // Close sidebar when clicking on a navigation link
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.remove('active');
      }
    });
  });
  
  // Close modal with escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const modals = document.querySelectorAll('.modal.active');
      modals.forEach(modal => closeModal(modal.id));
    }
  });
});
