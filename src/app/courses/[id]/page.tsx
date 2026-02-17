'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Play, Clock, Users, BookOpen, CheckCircle, Lock,
  ChevronRight, Star, ArrowLeft, Video, FileText, Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  duration: number | null;
  order: number;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string | null;
  published: boolean;
  lessons: Lesson[];
}

export default function CourseDetailPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`/api/courses/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data.course);
          
          // Check if enrolled
          if (isAuthenticated && user) {
            const token = localStorage.getItem('institut-biznis-token');
            const enrollResponse = await fetch(`/api/courses/${params.id}/check-enrollment`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (enrollResponse.ok) {
              const enrollData = await enrollResponse.json();
              setIsEnrolled(enrollData.enrolled);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [params.id, isAuthenticated, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setEnrolling(true);
    try {
      const token = localStorage.getItem('institut-biznis-token');
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: params.id })
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsEnrolled(true);
        alert('Uspešno upisani na kurs! +50 XP');
      } else {
        alert(data.error || 'Došlo je do greške');
      }
    } catch (error) {
      alert('Došlo je do greške');
    } finally {
      setEnrolling(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('sr-RS') + ' RSD';
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '? min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const totalDuration = course?.lessons.reduce((sum, l) => sum + (l.duration || 0), 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-dark-400">Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Kurs ne postoji</h2>
          <Link href="/courses"><Button>Vrati se na kurseve</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white pb-24">
      {/* Header */}
      <div className="relative h-64 md:h-80 bg-dark-800 overflow-hidden">
        {course.thumbnail && (
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
        
        <Link href="/courses" className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-dark-800/80 hover:bg-dark-700 rounded-lg backdrop-blur transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Nazad
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
        {/* Course Info */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
              <p className="text-dark-400 mb-4">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-dark-400 mb-4">
                <span className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  {course.lessons.length} lekcija
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(totalDuration)}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Sertifikat
                </span>
              </div>

              {/* Enroll Button */}
              {isEnrolled ? (
                <Link href={`/courses/${course.id}/learn`}>
                  <Button className="w-full md:w-auto" size="lg">
                    <Play className="w-5 h-5 mr-2" />
                    Nastavi sa učenjem
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={handleEnroll}
                  loading={enrolling}
                  className="w-full md:w-auto"
                  size="lg"
                >
                  Upisi se - {formatPrice(course.price)}
                </Button>
              )}
            </div>

            {/* Price Card */}
            <div className="md:w-64 p-4 bg-dark-800/50 rounded-xl">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-blue-400">{formatPrice(course.price)}</p>
                <p className="text-sm text-dark-400">Jednokratno</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Pristup svim lekcijama</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>PDF materijali</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Sertifikat</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Q&A podrška</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Lessons List */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Sadržaj kursa</h2>
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => (
              <div 
                key={lesson.id}
                className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl hover:bg-dark-700/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-400">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  {lesson.description && (
                    <p className="text-sm text-dark-400">{lesson.description}</p>
                  )}
                </div>
                {lesson.duration && (
                  <span className="flex items-center gap-1 text-sm text-dark-400">
                    <Clock className="w-4 h-4" />
                    {formatDuration(lesson.duration)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
