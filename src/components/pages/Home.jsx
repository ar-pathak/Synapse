import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router';

const Home = () => {
  const isLoggedIn = useSelector((state) => state.userinfo.isLoggedIn)
  if (isLoggedIn) {
    return <Navigate to="/feed"/>
  }
  return (
    <div className="min-h-screen bg-[#1A1B1E] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      {/* Hero Section */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight">
                Find Your Perfect Developer Match
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/60 max-w-xl mx-auto md:mx-0">
                Connect with developers who share your passion for coding and innovation.
                Build meaningful professional relationships in the tech community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/auth/signup"
                  className="w-full sm:w-auto bg-white text-[#1A1B1E] px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all duration-200 transform hover:scale-105 text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="/auth/signin"
                  className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#1A1B1E] transition-all duration-200 transform hover:scale-105 text-center"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="Team of developers collaborating"
                className="w-full max-w-lg mx-auto rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div className="p-4 sm:p-6 bg-white/5 backdrop-blur-md rounded-xl ring-1 ring-white/10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-sm sm:text-base text-white/60">Active Developers</div>
            </div>
            <div className="p-4 sm:p-6 bg-white/5 backdrop-blur-md rounded-xl ring-1 ring-white/10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">5K+</div>
              <div className="text-sm sm:text-base text-white/60">Successful Matches</div>
            </div>
            <div className="p-4 sm:p-6 bg-white/5 backdrop-blur-md rounded-xl ring-1 ring-white/10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-sm sm:text-base text-white/60">Countries</div>
            </div>
            <div className="p-4 sm:p-6 bg-white/5 backdrop-blur-md rounded-xl ring-1 ring-white/10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm sm:text-base text-white/60">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-white">Why Choose Synapse?</h2>
          <p className="text-base sm:text-lg text-white/60 text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
            Our platform is designed to help developers connect, collaborate, and grow their careers in the tech industry.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 ring-1 ring-white/10">
              <div className="text-white text-3xl sm:text-4xl mb-4">👥</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Smart Matching</h3>
              <p className="text-sm sm:text-base text-white/60">
                Our advanced algorithm matches you with developers based on your skills, interests, and goals.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 ring-1 ring-white/10">
              <div className="text-white text-3xl sm:text-4xl mb-4">💼</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Professional Network</h3>
              <p className="text-sm sm:text-base text-white/60">
                Build meaningful connections with developers from around the world.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 ring-1 ring-white/10">
              <div className="text-white text-3xl sm:text-4xl mb-4">🚀</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Career Growth</h3>
              <p className="text-sm sm:text-base text-white/60">
                Find mentors, collaborators, and opportunities to advance your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-white">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="bg-white/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl sm:text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Create Your Profile</h3>
              <p className="text-sm sm:text-base text-white/60">Sign up and showcase your skills, experience, and interests.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl sm:text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Get Matched</h3>
              <p className="text-sm sm:text-base text-white/60">Our algorithm finds the perfect developers for you to connect with.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl sm:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Start Collaborating</h3>
              <p className="text-sm sm:text-base text-white/60">Connect, chat, and start building amazing projects together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-white">What Developers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-md ring-1 ring-white/10">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
                  alt="User"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-white">John Doe</h4>
                  <p className="text-sm sm:text-base text-white/60">Full Stack Developer</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-white/60">
                "Synapse helped me find amazing collaborators for my open-source projects. The matching algorithm is spot on!"
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-md ring-1 ring-white/10">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                  alt="User"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-white">Jane Smith</h4>
                  <p className="text-sm sm:text-base text-white/60">Frontend Developer</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-white/60">
                "I found my dream job through Synapse! The community is incredibly supportive and professional."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-white">Ready to Start Your Journey?</h2>
          <p className="text-base sm:text-lg md:text-xl text-white/60 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already building their professional network on Synapse.
          </p>
          <Link
            to="/auth/signup"
            className="inline-block w-full sm:w-auto bg-white text-[#1A1B1E] px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all duration-200 transform hover:scale-105"
          >
            Create Your Profile
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;