import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, Headphones, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-glow to-accent py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center justify-center space-x-2 mb-4">
              <Star className="h-5 w-5 text-secondary animate-pulse" />
              <span className="text-secondary text-sm font-semibold tracking-wide uppercase">
                Sacred Scripture
              </span>
              <Star className="h-5 w-5 text-secondary animate-pulse" />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
              Discover the Beauty of
              <span className="block bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                The Holy Quran
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Read, listen, and explore the divine words with beautiful translations, 
              audio recitations, and powerful search capabilities
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/browse">
                <Button size="lg" variant="secondary" className="gap-2 group shadow-lg hover:shadow-xl">
                  <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Start Reading
                </Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline" className="gap-2 bg-background/10 border-primary-foreground/20 text-primary-foreground hover:bg-background/20 shadow-lg">
                  <Search className="h-5 w-5" />
                  Search Quran
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything You Need to Connect with the Quran
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A comprehensive platform designed to enhance your Quranic experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl animate-fade-in">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <BookOpen className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Multiple Translations
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access the Quran in various languages with authentic translations from renowned scholars worldwide
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent to-primary-glow flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Headphones className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Audio Recitations
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Listen to beautiful recitations by world-famous Qaris with high-quality audio streaming
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Search className="h-7 w-7 text-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Powerful Search
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find any verse instantly with our advanced search across multiple translations and editions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Begin Your Journey Today
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of readers worldwide in exploring the divine guidance and wisdom of the Holy Quran
            </p>
            <div className="pt-4">
              <Link to="/browse">
                <Button size="lg" className="gap-2 shadow-xl hover:shadow-2xl group">
                  <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Explore All Surahs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
