import { Link } from 'react-router-dom';
import { Surah } from '@/types/quran';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

interface SurahCardProps {
  surah: Surah;
}

const SurahCard = ({ surah }: SurahCardProps) => {
  return (
    <Link to={`/surah/${surah.number}`}>
      <Card className="group p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-card/50">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold text-sm shadow-md">
                {surah.number}
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {surah.englishName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {surah.englishNameTranslation}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="secondary" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                {surah.numberOfAyahs} verses
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs"
              >
                {surah.revelationType}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-arabic text-primary" dir="rtl">
              {surah.name}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default SurahCard;
