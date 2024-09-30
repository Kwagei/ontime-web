<template>
    <!-- Nav Section -->
    <nav class="navbar" id="shadow">
        <div class="container-fluid">
            <div class="navbar-brand me-auto">
            <a class="stretched-link" href="#">
                <img src="../assets/images/ontime_logo.jpg" width="50" height="50" alt="Boosted - Back to Home" loading="lazy">
            </a>
            </div>
            <form class="d-flex navbar-item gap-2" role="search">
                <button class="btn btn-primary" type="submit">About</button>
                <button class="btn btn-primary" type="submit">Features</button>
                <button class="btn btn-primary" type="submit">Our team</button>
                <router-link :to="{ name: 'sign-in' }">
                    <button class="btn btn-primary" type="submit">Log in</button>
                </router-link>
            </form>
        </div>
    </nav>
    <!-- Hero Section -->
    <div id="app">
    <section class="p-3 mb-2 fw-bold bg-light">
      <div class="container">
        <h1 class="display-2">Stay Connected With <span id="orange">On</span>time</h1>
        <p class="">
          Our app is a visit check-in and attendance system designed to streamline the process of recording visitor information, managing attendance for events, and ensuring security and accountability.
        </p>
        <router-link :to="{ name: 'dashboard' }">
          <button type="button" class="btn btn-primary" style="padding: 0.5rem 1.5rem; font-weight: 600">Dashboard</button>
        </router-link>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-section">
      <div class="container">
        <h2 class="section-title">About Ontime</h2>
        <p>
          Ontime is a comprehensive platform offering efficient solutions for attendance management, visitor check-ins, and event scheduling. Our system ensures streamlined operations, data security, and real-time collaboration for seamless team management.
        </p>
      </div>
    </section>

    
    <!-- Demo Credentials Section -->
    <section id="demo" class="demo-section">
      <div class="container">
        <h2 class="section-title">Demo Credentials</h2>
        <p>
          Try Ontime with the following credentials to explore the platform's features:
        </p>
        <div class="credentials-img d-flex">
          <img src="../assets/images/Screenshot 2024-09-30 at 18-23-54 OnTime.png" alt="">
          <img src="../assets/images/loginshot3.png" alt="">

        </div>
      </div>
    </section>
    
    <!-- Features Section -->
     <section class="feature-section">
        <div class="container">
          <h2>Features</h2>
        </div>
     </section>


    <!-- Our Team Section -->
    <section id="team" class="team-section p-3 mb-2 fw-bold bg-light">
      <div class="container">
        <h2 class="section-title">Our Team</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="team-img">
              <img src="../assets/images/nathan2.jpg" alt="Team Member" class="team-photo"/>
            </div>
            <div class="team-name">
              <h3 class="team-name">Nathan T. Siafa</h3>
            </div>
            <div class="team-role">
              <p class="team-role">Project Manager</p>
            </div>
          </div>
          <div class="team-member">
            <div class="team-img">
              <img src="../assets/images/peace.jpg" alt="Team Member" class="team-photo"/>
            </div>
            <div class="team-name">
              <h3 class="team-name">Emmanuel Peace Browne</h3>
            </div>
            <div class="team-role">
              <p class="team-role">Developer</p>
            </div>
          </div>
          <div class="team-member">
            <div class="team-img">
              <img src="../assets/images/dave.jpg" alt="Team Member" class="team-photo"/>
            </div>
            <div class="team-name">
              <h3 class="team-name">Dave Wonnah</h3>
            </div>
            <div class="team-role">
              <p class="team-role">Developer</p>
            </div>
          </div>
          <div class="team-member">
            <div class="team-img">
              <img src="../assets/images/jeedo.jpg" alt="Team Member" class="team-photo"/>
            </div>
            <div class="team-name">
              <h3 class="team-name">Jee-do Gbozee Arkio</h3>
            </div>
            <div class="team-role">
              <p class="team-role">Developer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Footer -->
    <footer class="footer navbar" data-bs-theme="dark">
      <h2 class="visually-hidden">Sitemap & information</h2>
      <div class="container-xxl footer-terms">
        <ul class="navbar-nav gap-md-3">
          <li class="fw-bold">© <span id="orange">On</span>time 2024</li>
          <li><a class="nav-link" href="#">Terms and conditions</a></li>
          <li><a class="nav-link" href="#">Privacy</a></li>
          <li><a class="nav-link" href="#">Accessibility statement</a></li>
          <li><a class="nav-link" href="#">Cookie policy</a></li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>

</script>

<style scoped>
/* General Styling */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#shadow{
    position: sticky;
    top: 0;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

/* Hero Section */
.hero-section {
  color: white;
  text-align: center;
  padding: 100px 0;
}

.cta-button {
  background-color: #ff9800;
  border: none;
  padding: 15px 30px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

#flexlayout{
    display: flex;
}
.cta-button:hover {
  background-color: #e68900;
}

/* About Section */
.about-section {
  padding: 60px 0;
  background-color: #f9f9f9;
}

/* Features Section */
.feature-section{
  padding: 60px 0;
  margin-bottom: 10px;
  margin-top: 10px;
  background-color: #f9f9f9;
}

/* Demo Credentials Section */
.demo-section {
  padding: 60px 0;
  margin-bottom: 10px;
  margin-top: 10px;
  background-color: #f9f9f9;
}

.credentials-img {
  justify-content: space-between;
}

.demo-credentials ul {
  list-style-type: none;
  padding-left: 0;
}

.demo-credentials li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.credential-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

/* Our Team Section */
.team-section {
  padding: 60px 0;
  text-align: center;
  background-color: #f5f5f5;
}

.team-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.section-title{
  margin-bottom: 40px;
}

.team-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

#orange {
  color: #e68900;
}
</style>

