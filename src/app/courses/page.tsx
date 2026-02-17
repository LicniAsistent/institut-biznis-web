'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Play, Clock, Users, BookOpen, CheckCircle, Lock,
  ChevronRight, Star, TrendingUp
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string | null;
  published: boolean;
  createdAt: string;
  _count: {
    enrollments: number;
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses?published=true');
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses || []);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setEnrolling(courseId);
    try {
      const token = localStorage.getItem('institut-biznis-token');
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Uspešno upisani na kurs!');
        router.push(`/courses/${courseId}`);
      } else {
        alert(data.error || 'Došlo je do greške');
      }
    } catch (error) {
      alert('Došlo je do greške');
    } finally {
      setEnrolling(null);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('sr-RS') + ' RSD';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-dark-400">Učitavanje kurseva...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white pb-24">
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[-30%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-purple-500/10 blur-[150px]" />
      </div>

      {/* Header */}
      <div className="bg-dark-800/50 border-b border-dark-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">📚 Kursevi</h1>
          <p className="text-dark-400">Stručni kursevi za vaš biznis</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg"><BookOpen className="w-5 h-5 text-blue-400" /></div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-xs text-dark-400">Kurseva</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg"><Users className="w-5 h-5 text-green-400" /></div>
              <div>
                <p className="text-2xl font-bold">{courses.reduce((sum, c) => sum + c._count.enrollments, 0)}</p>
                <p className="text-xs text-dark-400">Polaznika</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg"><Star className="w-5 h-5 text-yellow-400" /></div>
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-xs text-dark-400">Prosek</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg"><TrendingUp className="w-5 h-5 text-purple-400" /></div>
              <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-dark-400">Završenih</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden group hover:border-blue-500/50 transition-colors">
              {/* Thumbnail */}
              <div className="relative h-48 bg-dark-800 overflow-hidden">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-dark-600" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-bold">
                    {formatPrice(course.price)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-dark-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-dark-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course._count.enrollments} polaznika
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link 
                    href={`/courses/${course.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg font-medium transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                    Detalji
                  </Link>
                  <Button 
                    onClick={() => handleEnroll(course.id)}
                    loading={enrolling === course.id}
                    className="flex-1"
                  >
                    Upisi se
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <Card className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Nema kurseva</h3>
            <p className="text-dark-400">Trenutno nema dostupnih kurseva.</p>
          </Card>
        )}
      </main>
    </div>
  );
}
