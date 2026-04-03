// Initialize Supabase Client
const supabaseUrl = 'https://wsapetcsayrzmcuyvqkj.supabase.co';
const supabaseKey = 'sb_publishable_-eNsnkpvk4fb__QhyQfgSA_Kk43RVwU';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// UI Toggles
function voxenOpen() {
    document.getElementById("voxen-auth-overlay").style.display = "flex";
}

function voxenClose() {
    document.getElementById("voxen-auth-overlay").style.display = "none";
}

function voxenShowLogin() {
    document.getElementById("voxen-login").classList.remove("hidden");
    document.getElementById("voxen-signup").classList.add("hidden");
    document.getElementById("voxen-login-msg").style.display = "none";
}

function voxenShowSignup() {
    document.getElementById("voxen-signup").classList.remove("hidden");
    document.getElementById("voxen-login").classList.add("hidden");
    document.getElementById("voxen-signup-msg").style.display = "none";
}

// Authentication Logic
document.addEventListener("DOMContentLoaded", () => {
    
    // LOGIN
    document.getElementById('voxen-login-btn').addEventListener('click', async () => {
        const email = document.getElementById('voxen-login-email').value;
        const password = document.getElementById('voxen-login-password').value;
        const msgBox = document.getElementById('voxen-login-msg');
        
        msgBox.style.display = "none";
        document.getElementById('voxen-login-btn').innerText = "Authenticating...";
        
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });
        
        document.getElementById('voxen-login-btn').innerText = "Login";

        if (error) {
            msgBox.style.color = "#ff4d4f";
            msgBox.innerText = error.message;
            msgBox.style.display = "block";
        } else {
            msgBox.style.color = "#4BB543";
            msgBox.innerText = "Access Granted. Initializing Interface...";
            msgBox.style.display = "block";
            setTimeout(() => {
                voxenClose();
                alert("Successfully Signed In as " + data.user.email);
            }, 1000);
        }
    });

    // SIGNUP
    document.getElementById('voxen-signup-btn').addEventListener('click', async () => {
        const email = document.getElementById('voxen-signup-email').value;
        const password = document.getElementById('voxen-signup-password').value;
        const name = document.getElementById('voxen-signup-name').value;
        const msgBox = document.getElementById('voxen-signup-msg');
        
        msgBox.style.display = "none";
        document.getElementById('voxen-signup-btn').innerText = "Registering...";

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name,
                }
            }
        });
        
        document.getElementById('voxen-signup-btn').innerText = "Create Account";

        if (error) {
            msgBox.style.color = "#ff4d4f";
            msgBox.innerText = error.message;
            msgBox.style.display = "block";
        } else {
            msgBox.style.color = "#4BB543";
            msgBox.innerText = "Registration complete! Check your email to verify.";
            msgBox.style.display = "block";
            setTimeout(() => {
                voxenShowLogin();
            }, 2000);
        }
    });
});