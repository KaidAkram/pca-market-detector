import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Quote } from 'lucide-react';

const ProfessorCommentary = () => {
  return (
    <div className="h-full flex flex-col p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[2.5rem] relative overflow-hidden">
      <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
        <GraduationCap size={200} />
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-500/20 rounded-2xl">
          <GraduationCap className="text-indigo-400" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Scholarly Dispatch</h3>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-mono">Structural Manifold Analysis</p>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto pr-4 scrollbar-hide">
        <div className="relative pl-6 border-l border-indigo-500/30">
          <Quote className="absolute -left-3 top-0 text-indigo-500 bg-[#020205] p-1 rounded-full" size={20} />
          <p className="text-[13px] text-white/80 leading-relaxed italic font-serif">
            "Gentlemen, please direct your attention to the spectral entropy distribution. What we are observing 
            is not merely a 'market shift,' but a profound topological transformation of the return manifold. 
            When the eigenvalues begin to concentrate in the primary subspace, the orthogonal basis of our 
            asset universe is effectively collapsing. In a high-entropy state, the market possesses multiple 
            degrees of freedom; currently, we are seeing a singular, dominant latent pressure that 
            nullifies the traditional diversification hypothesis."
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-indigo-500 rounded-full" />
            <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Lecture Note: Orthonormal Basis Rotation</h4>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed text-justify">
            Recall that PCA is essentially an affine transformation that rotates the coordinate system 
            to align with the directions of maximal variance. To ensure temporal consistency in our 
            rolling analysis, we enforce a strict <strong>Sign Determinism Protocol</strong>. We fix the 
            orientation of each eigenvector <InlineMath math="\mathbf{v}_j" /> such that its dominant 
            component remains positive. Without this, the 'economic orientation' of our growth and 
            liquidity factors would oscillate sporadically, rendering the manifold uninterpretable.
          </p>
        </div>
        
        <div className="pt-6 border-t border-white/5 flex justify-between items-end">
          <div>
            <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest">Office Hours:</p>
            <p className="text-[10px] text-indigo-300 font-mono italic">
              Discussion on Spectral Gaps and Random Matrix Theory.
            </p>
          </div>
          <div className="text-[8px] text-white/10 font-mono uppercase">
            Quant-Theory-Dept // v2.5
          </div>
        </div>
      </div>
    </div>
  );
};

const InlineMath = ({ math }) => (
  <span className="font-mono text-indigo-300 mx-1">{math}</span>
);

export default ProfessorCommentary;
