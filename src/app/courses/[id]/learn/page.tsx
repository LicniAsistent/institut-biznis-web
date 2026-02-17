'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { 
  Play, CheckCircle, Lock, ChevronLeft, ChevronRight,
  Clock, FileText, Menu, X, Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  pdfUrl: string | null;
  duration: number | null;
  order: number;
}

interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function LearnPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const { user, isAuthenticated } = useAuth();
  const params = useParams();

  useEffect(() => {
    async function fetchCourse() {
      try {
        const token = localStorage.getItem('institut-biznis-token');
        const response = await fetch(`/api/courses/${params.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCourse(data.course);
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [params.id]);

  const currentLesson = course?.lessons[currentLessonIndex];
  const isFirst = currentLessonIndex === 0;
  const isLast = currentLessonIndex === (course?.lessons.length || 0) - 1;
  const progress = course ? Math.round(((currentLessonIndex + 1) / course.lessons.length) * 100) : 0;

  const handleNext = () => {
    if (!isLast && course) {
      setCurrentLessonIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst && course) {
      setCurrentLessonIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (currentLesson) {
      setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
      
      // Give XP
      const token = localStorage.getItem('institut-biznis-token');
      fetch('/api/user/update-xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ xp: 25 })
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Nemate pristup ovom kursu</h2>
          <Link href="/courses"><Button>Pregledaj kurseve</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white flex">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-dark-800 border-r border-dark-700 flex-shrink-0`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-dark-700">
            <Link href="/courses" className="flex items-center gap-2 text-dark-400 hover:text-white mb-4">
              <ChevronLeft className="w-4 h-4" />
              Nazad na kurseve
            </Link>
            <h2 className="font-bold">{course.title}</h2>
            
            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-dark-400">Napredak</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="flex-1 overflow-y-auto">
            {course.lessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson.id);
              const isActive = index === currentLessonIndex;
              
              return (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLessonIndex(index)}
                  className={`w-full flex items-center gap-3 p-4 text-left hover:bg-dark-700/50 transition-colors ${
                    isActive ? 'bg-blue-500/20 border-l-2 border-blue-500' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-green-500/20 text-green-400' : isActive ? 'bg-blue-500 text-white' : 'bg-dark-700 text-dark-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : <span className="text-sm">{index + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${isActive ? 'text-white' : 'text-dark-300'}`}>
                      {lesson.title}
                    </p>
                    {lesson.duration && (
                      <p className="text-xs text-dark-500">{lesson.duration} min</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Certificate */}
          {progress === 100 && (
            <div className="p-4 border-t border-dark-700">
              <Button className="w-full" variant="success">
                <Award className="w-4 h-4 mr-2" />
                Preuzmi sertifikat
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-16 bg-dark-800/50 border-b border-dark-700 flex items-center justify-between px-4">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-dark-700 rounded-lg"
          >
            {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-dark-400">
              Lekcija {currentLessonIndex + 1} od {course.lessons.length}
            </span>
          </div>
          
          <div className="w-10" />
        </div>

        {/* Video/Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {currentLesson && (
            <div className="max-w-4xl mx-auto">
              {/* Video Placeholder */}
              {currentLesson.videoUrl ? (
                <div className="aspect-video bg-dark-800 rounded-xl overflow-hidden mb-6">
                  <iframe
                    src={currentLesson.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video bg-dark-800 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                    <p className="text-dark-400">Video lekcija</p>
                    <p className="text-sm text-dark-500">URL će biti dodat</p>
                  </div>
                </div>
              )}

              {/* Lesson Info */}
              <Card className="p-6">
                <h1 className="text-2xl font-bold mb-4">{currentLesson.title}</h1>
                
                {currentLesson.description && (
                  <p className="text-dark-400 mb-6">{currentLesson.description}</p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                  <Button 
                    onClick={handlePrev}
                    disabled={isFirst}
                    variant="outline"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Prethodna
                  </Button>

                  {!completedLessons.has(currentLesson.id) && (
                    <Button onClick={handleComplete} variant="success">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Označi kao završeno (+25 XP)
                    </Button>
                  )}

                  {completedLessons.has(currentLesson.id) && (
                    <span className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Završeno
                    </span>
                  )}

                  <Button 
                    onClick={handleNext}
                    disabled={isLast}
                    variant="primary"
                  >
                    Sledeća
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>

              {/* PDF Materials */}
              {currentLesson.pdfUrl && (
                <Card className="p-6 mt-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    PDF Materijali
                  </h3>
                  <a 
                    href={currentLesson.pdfUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <FileText className="w-8 h-8 text-red-400" />
                    <div>
                      <p className="font-medium">Preuzmi materijal</p>
                      <p className="text-sm text-dark-400">PDF dokument</p>
                    </div>
                  </a>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
