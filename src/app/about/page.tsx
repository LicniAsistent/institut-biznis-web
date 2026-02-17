import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            O Institutu Biznis
          </h1>
          <Link href="/" className="text-green-600 hover:text-green-700">
            ← Nazad
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Vision */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 Naša Vizija
            </h2>
            <p className="text-gray-700 text-lg">
              Institut Biznis je mesto gde se susreću edukacija, zajednica i prilika. 
              Verujemo da svako može naučiti da bude uspešan preduzetnik — 
              bez obzira na prethodno iskustvo ili kapital.
            </p>
          </div>

          {/* Core Values */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              💡 Naše Vrednosti
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  🤝 Givers Gain
                </h3>
                <p className="text-sm text-gray-700">
                  Ko daje — dobija. Gradimo zajednicu gde svi rastu zajedno.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  🔗 Connections Before Capital
                </h3>
                <p className="text-sm text-gray-700">
                  Povezivanje ljudi je temelj svakog uspešnog biznisa.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">
                  📚 Praksa, ne teorija
                </h3>
                <p className="text-sm text-gray-700">
                  Učimo kroz rad, ne kroz knjige. Rezultati su jedino što brojimo.
                </p>
              </div>
            </div>
          </div>

          {/* Founder */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              👤 O Osnivaču
            </h2>
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-3xl">
                👋
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Petar Jurković
                </h3>
                <p className="text-gray-600 mt-1">
                  Founder & CEO
                </p>
                <p className="text-gray-700 mt-4">
                  Sa preko 5 godina iskustva u auto detailing biznisu (4,000+ klijenata) 
                  i dostava biznisu (10,000+ dostava), Petar je naučio da je 
                  "problem jednog čoveka — rešenje za drugog."
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📊 U Brojkama
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">5+</div>
                <div className="text-sm text-gray-600">Godina iskustva</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">4,000+</div>
                <div className="text-sm text-gray-600">Klijenata</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">10,000+</div>
                <div className="text-sm text-gray-600">Dostava</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">1</div>
                <div className="text-sm text-gray-600">Vizija</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>© 2024 Institut Biznis. Sva prava zadržana.</p>
        </div>
      </footer>
    </div>
  );
}
