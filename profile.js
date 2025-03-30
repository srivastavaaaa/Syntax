// Initialize Bootstrap modal
const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));

// Handle theme toggle
document.querySelector('.theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const darkModeToggle = document.querySelector('.settings-item:nth-child(2) input');
    darkModeToggle.checked = document.body.classList.contains('dark-mode');
});

// Handle dark mode toggle in settings
document.querySelector('.settings-item:nth-child(2) input').addEventListener('change', function(e) {
    document.body.classList.toggle('dark-mode', e.target.checked);
});

// Handle edit profile button
document.querySelector('.edit-profile-btn').addEventListener('click', function() {
    editProfileModal.show();
});

// Handle save profile changes
document.getElementById('saveProfileChanges').addEventListener('click', function() {
    // Get form values
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        bio: document.getElementById('bio').value,
        timezone: document.getElementById('timezone').value,
        preferences: {
            visualLearning: document.getElementById('visualLearning').checked,
            practicalExercises: document.getElementById('practicalExercises').checked,
            peerLearning: document.getElementById('peerLearning').checked
        }
    };

    // Update profile display
    document.querySelector('.profile-name').textContent = formData.fullName;
    document.querySelector('.profile-email').textContent = formData.email;

    // Show success message
    const toast = new bootstrap.Toast(document.createElement('div'));
    toast.show();

    // Close modal
    editProfileModal.hide();

    // You would typically send this data to a server
    console.log('Profile data to be saved:', formData);
});

// Handle delete account button
document.querySelector('.delete-account-btn').addEventListener('click', function() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // Implement account deletion logic here
        alert('Account deletion functionality will be implemented here');
    }
});

// Handle settings toggles
document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
        const settingName = this.closest('.settings-item').querySelector('.settings-label').textContent;
        console.log(`${settingName} setting changed to: ${this.checked}`);
        // You can implement specific functionality for each setting here
    });
}); 