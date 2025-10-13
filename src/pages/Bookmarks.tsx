import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              My Bookmarks
            </h1>
            <p className="text-lg text-muted-foreground">
              Your saved verses for quick access
            </p>
          </div>

          {/* Empty State */}
          <Card className="p-12 text-center animate-fade-in">
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mx-auto flex items-center justify-center">
                <Bookmark className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                No Bookmarks Yet
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start bookmarking your favorite verses while reading the Quran
              </p>
              <div className="pt-4">
                <Link to="/browse">
                  <Button className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Browse Surahs
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
