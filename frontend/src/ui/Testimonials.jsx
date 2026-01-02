import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: "Dr. Sarah Chen",
    role: "Pharmacy Director",
    text: "MedFlow transformed how we manage our pharmacy. The low stock alerts alone saved us thousands.",
    initials: "SC"
  },
  {
    name: "Michael Roberts",
    role: "Store Manager",
    text: "The patient management system is intuitive and comprehensive. Our staff learned it in a day.",
    initials: "MR"
  },
  {
    name: "Dr. Emily Watson",
    role: "Chief Pharmacist",
    text: "Finally, a system that actually understands pharmacy workflows. Absolutely brilliant.",
    initials: "EW"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16">
        <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Testimonials</span>
        <h2 className="text-4xl font-extrabold text-slate-900">Loved by pharmacy teams</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((r, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />)}
            </div>
            <p className="text-slate-600 mb-8 italic">"{r.text}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-100">
                {r.initials}
              </div>
              <div>
                <div className="font-bold text-slate-900">{r.name}</div>
                <div className="text-xs text-slate-400 font-medium">{r.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;