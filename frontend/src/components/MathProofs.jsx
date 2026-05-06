import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sigma, Binary, Microscope, BookOpen, Target, Network, Layers, Database, RotateCw, Activity, Spline, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { getMathProofs } from '../services/api';

const MathSection = ({ title, subtitle, icon: Icon, children }) => (
  <section className="mb-32 relative">
    <div className="absolute top-10 -left-6 bottom-10 w-0.5 bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-transparent hidden md:block" />
    <div className="flex items-center gap-5 mb-10 relative">
      <div className="absolute -left-10 w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/50 hidden md:block shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
        <Icon className="text-blue-400" size={28} />
      </div>
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-1">{title}</h2>
        <p className="text-blue-400/60 text-xs font-mono uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:bg-white/[0.03] transition-colors">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {children}
    </div>
  </section>
);

const MathProofs = () => {
  const [proofs, setProofs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const data = await getMathProofs();
        setProofs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProofs();
  }, []);

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-blue-500/30 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        {/* Navigation */}
        <Link to="/" className="inline-flex items-center gap-3 text-white/30 hover:text-white transition-all mb-16 group">
          <div className="p-2 rounded-full border border-white/10 group-hover:border-white/30 group-hover:-translate-x-1 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium tracking-wide">Return to Executive Dashboard</span>
        </Link>

        {/* Academic Header */}
        <header className="mb-32 border-l-2 border-blue-500/30 pl-10 py-2">
          <div className="flex items-center gap-3 mb-6">
            <Microscope className="text-blue-500" size={20} />
            <span className="text-blue-500 font-mono text-[11px] font-bold uppercase tracking-[0.4em]">Extended Mathematical Derivation v4.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
            THE MATHEMATICS OF <br />
            <span className="text-blue-500">MARKET REGIMES</span>
          </h1>
          <p className="text-xl text-white/50 max-w-3xl leading-relaxed font-light">
            An unabridged derivation of the Spectral Eigendecomposition framework. Detailed calculus of the 16-step PCA pipeline, integrating Random Matrix Theory, the Lagrangian multiplier optimization, and Markov transition calculus.
          </p>
        </header>

        {/* Utility Section: How This Helps Us */}
        <section className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-10 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-[3rem]">
            <div className="flex items-center gap-4 mb-6">
              <Target className="text-blue-400" size={32} />
              <h3 className="text-2xl font-bold italic">Why This Math Matters</h3>
            </div>
            <ul className="space-y-6 text-white/60 leading-relaxed text-sm">
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" /> 
                <div>
                  <strong className="text-white block mb-1">Structural Orthogonality via Lagrangian Optimization</strong>
                  Unlike standard beta models that assume static correlations, PCA mathematically extracts uncorrelated (orthogonal) factors by solving a constrained variance-maximization problem, isolating true inflation shocks from mere equity volatility.
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" /> 
                <div>
                  <strong className="text-white block mb-1">Regime Predictive Alpha via RMT</strong>
                  By tracking Spectral Entropy against the Marchenko-Pastur bound, we detect the "collapse of dimensionality" *before* a full market crash occurs, enabling pre-emptive capital preservation.
                </div>
              </li>
            </ul>
          </div>
          <div className="p-10 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[3rem] flex flex-col justify-center">
            <h3 className="text-2xl font-bold italic mb-6">The Quantitative Premise</h3>
            <p className="text-white/60 italic leading-relaxed text-lg">
              "Financial markets are high-dimensional, noisy manifolds. We do not predict individual price trajectories; rather, we project the entire market onto its dominant eigenspace to trade the underlying structural rotation using stochastic calculus and spectral graph theory."
            </p>
          </div>
        </section>

        {/* Content Pipeline */}
        <div className="space-y-16">
          
          <MathSection title="1. Ingestion & Forward-Fill Imputation" subtitle="Step 1-2: Data Continuity" icon={Database}>
            <p className="text-white/70 leading-relaxed mb-6 text-lg">
              The pipeline ingests raw daily close prices for <InlineMath math="p=10" /> global macro assets over <InlineMath math="n" /> trading days. Financial datasets are inherently sparse due to differing market holidays across FX, Commodities, and Equities.
            </p>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              To resolve missing values (<InlineMath math="\text{NaN}" />) without introducing look-ahead bias, we apply <strong>Forward-Fill Imputation</strong>, defining the raw price matrix <InlineMath math="P \in \mathbb{R}^{n \times p}" /> as:
            </p>
            <div className="bg-black/40 py-8 px-4 rounded-3xl border border-white/5 mb-10 shadow-inner">
              <BlockMath math="P_{t, j} = \begin{cases} P_{t, j} & \text{if observed} \\ P_{t-1, j} & \text{if unobserved} \end{cases}" />
            </div>
            <p className="text-white/50 text-sm">
              <em>Reference:</em> This ensures causality. Linear interpolation is strictly prohibited as it leverages future data <InlineMath math="P_{t+1}" /> to estimate <InlineMath math="P_t" />, fundamentally destroying backtest integrity (Eckner, 2007).
            </p>
          </MathSection>

          <MathSection title="2. Stationarity & The Unit Root Problem" subtitle="Step 3-4: The ADF Proof & Information Criteria" icon={Binary}>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              Raw prices are non-stationary, integrated of order one, <InlineMath math="I(1)" />. Eigendecomposition on <InlineMath math="I(1)" /> data produces spurious principal components (Hamilton, 1989). We map prices to logarithmic returns <InlineMath math="r_{t,j}" />:
            </p>
            <div className="bg-black/40 py-8 px-4 rounded-3xl border border-white/5 mb-10 shadow-inner">
              <BlockMath math="r_{t, j} = \ln(P_{t, j}) - \ln(P_{t-1, j}) \approx \frac{P_{t,j} - P_{t-1,j}}{P_{t-1,j}}" />
            </div>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              We formally prove stationarity <InlineMath math="I(0)" /> via the <strong>Augmented Dickey-Fuller (ADF)</strong> test. The test evaluates the null hypothesis <InlineMath math="H_0" /> (presence of a unit root) via the following autoregressive OLS regression:
            </p>
            <div className="bg-black/20 py-8 px-4 rounded-3xl border border-white/5 mb-10 italic text-blue-300/80">
              <BlockMath math="\Delta y_t = \alpha + \beta t + \gamma y_{t-1} + \sum_{i=1}^k \delta_i \Delta y_{t-i} + \varepsilon_t" />
            </div>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              The lag length <InlineMath math="k" /> is selected dynamically by minimizing the Akaike Information Criterion (AIC):
            </p>
            <div className="bg-black/40 py-6 px-4 rounded-3xl border border-white/5 mb-10 shadow-inner">
              <BlockMath math="\text{AIC} = 2k - 2\ln(\hat{L}) \approx n \ln\left(\frac{\text{RSS}}{n}\right) + 2k" />
            </div>
            <p className="text-white/70 leading-relaxed mb-8">
              We reject <InlineMath math="H_0" /> if the t-statistic for <InlineMath math="\gamma" /> is less than the critical value (typically <InlineMath math="p < 0.05" />). Below are the live proofs validating our <InlineMath math="\mathbb{R}^{n \times 10}" /> stationary manifold:
            </p>
            
            {/* Live Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proofs && Object.entries(proofs).map(([ticker, result]) => (
                <div key={ticker} className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/[0.07] transition-colors flex justify-between items-center">
                  <div>
                    <p className="font-bold text-blue-100">{ticker}</p>
                    <p className="text-[10px] text-white/30 font-mono mt-1">TEST STAT: {result.test_statistic.toFixed(4)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-bold tracking-widest ${result.is_stationary ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.is_stationary ? 'STATIONARY' : 'FAILED'}
                    </p>
                    <p className="text-[9px] text-white/20 font-mono">p={result.p_value.toExponential(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </MathSection>

          <MathSection title="3. Standardization (Z-Score)" subtitle="Step 5: Variance Equalization" icon={Layers}>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              Because asset classes possess vastly different volatilities, the raw return matrix <InlineMath math="X" /> is standardized. Without standardization, the PCA algorithm will erroneously maximize variance by simply selecting the asset with the highest unbounded volatility.
            </p>
            <div className="bg-black/40 py-8 px-4 rounded-3xl border border-white/5 shadow-inner">
              <BlockMath math="\tilde{X}_{t, j} = \frac{X_{t, j} - \mu_j}{\sigma_j} \quad \text{where} \quad \sigma_j^2 = \frac{1}{n-1}\sum_{t=1}^n (X_{t,j} - \mu_j)^2" />
            </div>
          </MathSection>

          <MathSection title="4. The Sample Covariance Matrix" subtitle="Step 6: Dependency Structure" icon={Network}>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              We compute the symmetric, positive semi-definite sample covariance matrix <InlineMath math="\Sigma \in \mathbb{R}^{p \times p}" />. This matrix captures the complete linear cross-sectional dependency structure. Since <InlineMath math="\tilde{X}" /> is standardized, <InlineMath math="\Sigma" /> is numerically identical to the Pearson Correlation matrix <InlineMath math="R" />.
            </p>
            <div className="bg-black/40 py-8 px-4 rounded-3xl border border-white/5 mb-8 shadow-inner">
              <BlockMath math="\Sigma = \frac{1}{n-1} \tilde{X}^T \tilde{X}" />
            </div>
            <p className="text-white/70 leading-relaxed text-lg mb-4">
              A critical property of <InlineMath math="\Sigma" /> is that its trace is exactly equal to the total number of assets <InlineMath math="p" />:
            </p>
            <div className="bg-black/20 py-4 px-4 rounded-3xl border border-white/5 italic text-blue-300/80">
              <BlockMath math="\text{Tr}(\Sigma) = \sum_{j=1}^p \Sigma_{jj} = \sum_{j=1}^p 1 = p" />
            </div>
          </MathSection>

          <MathSection title="5. Spectral Eigendecomposition via Lagrangian" subtitle="Step 7: The Core PCA Engine Derivation" icon={Sigma}>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              We seek a unit vector <InlineMath math="\mathbf{w} \in \mathbb{R}^p" /> (where <InlineMath math="\mathbf{w}^T \mathbf{w} = 1" />) that maximizes the variance of the projected data <InlineMath math="\mathbf{z} = \tilde{X} \mathbf{w}" />. The variance to maximize is:
            </p>
            <div className="bg-black/40 py-6 px-4 rounded-3xl border border-white/5 mb-8 shadow-inner">
              <BlockMath math="\text{Var}(\tilde{X} \mathbf{w}) = \frac{1}{n-1} (\tilde{X} \mathbf{w})^T (\tilde{X} \mathbf{w}) = \mathbf{w}^T \left( \frac{1}{n-1} \tilde{X}^T \tilde{X} \right) \mathbf{w} = \mathbf{w}^T \Sigma \mathbf{w}" />
            </div>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              We formulate this as a constrained optimization problem using the Lagrangian multiplier <InlineMath math="\lambda" />:
            </p>
            <div className="bg-black/20 py-6 px-4 rounded-3xl border border-white/5 mb-8 italic text-blue-300/80">
              <BlockMath math="\mathcal{L}(\mathbf{w}, \lambda) = \mathbf{w}^T \Sigma \mathbf{w} - \lambda (\mathbf{w}^T \mathbf{w} - 1)" />
            </div>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              Taking the partial derivative with respect to <InlineMath math="\mathbf{w}" /> and setting it to zero yields the fundamental eigenvalue equation:
            </p>
            <div className="bg-black/40 py-8 px-4 rounded-3xl border border-white/5 mb-8 shadow-inner">
              <BlockMath math="\frac{\partial \mathcal{L}}{\partial \mathbf{w}} = 2 \Sigma \mathbf{w} - 2 \lambda \mathbf{w} = 0 \implies \Sigma \mathbf{w} = \lambda \mathbf{w}" />
            </div>
            <p className="text-white/70 leading-relaxed text-lg">
              Thus, the optimal projection directions are the eigenvectors <InlineMath math="\mathbf{v}_i" /> of <InlineMath math="\Sigma" />, and the variance captured by each direction is exactly its corresponding eigenvalue <InlineMath math="\lambda_i" />.
            </p>
          </MathSection>

          <MathSection title="6. Variance Ratios & Dimensionality" subtitle="Step 8-10: Information Condensation" icon={Activity}>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              We sort the eigenvalues in descending order <InlineMath math="\lambda_1 \geq \lambda_2 \geq \dots \geq \lambda_p" />. The explained variance ratio <InlineMath math="\rho_k" /> defines the information content of each principal component:
            </p>
            <div className="bg-black/40 py-8 px-4 rounded-3xl border border-white/5 mb-8 shadow-inner">
              <BlockMath math="\rho_k = \frac{\lambda_k}{\sum_{i=1}^p \lambda_i} = \frac{\lambda_k}{\text{Tr}(\Sigma)} = \frac{\lambda_k}{p}" />
            </div>
            <p className="text-white/70 leading-relaxed text-lg">
              Following Bai & Ng (2002) information criteria and the classic 80% heuristic, we truncate the dimensionality from 10 to 3. These top 3 components typically capture the macro "Market Risk," "FX/Liquidity," and "Inflation" factors.
            </p>
          </MathSection>

          <MathSection title="7. Sign Determinism" subtitle="Step 11: Temporal Continuity" icon={ArrowRightLeft}>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              Eigenvectors suffer from <strong>sign ambiguity</strong>. Since <InlineMath math="\Sigma \mathbf{v} = \lambda \mathbf{v}" />, it is equally true that <InlineMath math="\Sigma (-\mathbf{v}) = \lambda (-\mathbf{v})" />. In a rolling window context, an eigenvector might randomly flip by <InlineMath math="180^\circ" /> from day <InlineMath math="t" /> to <InlineMath math="t+1" />, causing artificial volatility in the trading signals.
            </p>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              We mathematically enforce temporal continuity by forcing the element with the maximum absolute loading to always be positive:
            </p>
            <div className="bg-black/20 py-8 px-4 rounded-3xl border border-white/5 italic text-blue-300/80">
              <BlockMath math="\mathbf{v}_i \leftarrow \mathbf{v}_i \times \text{sgn}\left(\mathbf{v}_{i, \arg\max_j |\mathbf{v}_{i, j}|}\right)" />
            </div>
          </MathSection>

          <MathSection title="8. Factor Projection & Correlation Circles" subtitle="Step 12-14: The 3D Space" icon={Spline}>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              The original standardized dataset <InlineMath math="\tilde{X}" /> is projected onto the truncated basis <InlineMath math="\mathbf{V}_k = [\mathbf{v}_1, \dots, \mathbf{v}_k]" /> to compute the daily Principal Component scores <InlineMath math="\mathbf{Z}" />:
            </p>
            <div className="bg-black/40 py-8 px-4 rounded-3xl border border-white/5 mb-8 shadow-inner">
              <BlockMath math="\mathbf{Z}_{n \times k} = \tilde{X}_{n \times p} \cdot \mathbf{V}_{p \times k}" />
            </div>
            <p className="text-white/70 leading-relaxed text-lg">
              These coordinates <InlineMath math="(z_{t,1}, z_{t,2}, z_{t,3})" /> are exactly what drives the frontend 3D Factor Space visualization. The Pearson correlation between the original assets and these scores defines the <strong>Correlation Circle</strong> (Loadings Heatmap).
            </p>
          </MathSection>

          <MathSection title="9. Spectral Entropy & Random Matrix Theory" subtitle="Step 15: Marchenko-Pastur & Structural Instability" icon={RotateCw}>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              To differentiate true market factors from noise, we compare our empirical eigenvalues against the <strong>Marchenko-Pastur distribution</strong>, which defines the expected eigenvalue distribution of a completely random noise matrix of size <InlineMath math="n \times p" />:
            </p>
            <div className="bg-black/40 py-8 px-4 rounded-3xl border border-white/5 mb-10 shadow-xl">
              <BlockMath math="\rho(\lambda) = \frac{1}{2\pi \sigma^2} \frac{\sqrt{(\lambda_{max} - \lambda)(\lambda - \lambda_{min})}}{\gamma \lambda}" />
            </div>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              Where <InlineMath math="\gamma = p/n" /> and the bounds are <InlineMath math="\lambda_{\pm} = \sigma^2(1 \pm \sqrt{\gamma})^2" />. Eigenvalues above <InlineMath math="\lambda_{max}" /> contain structural signal. To measure the concentration of this signal, we calculate the <strong>Spectral Entropy</strong> <InlineMath math="H_{spec}" /> using normalized eigenvalues <InlineMath math="\tilde{\lambda}_i = \lambda_i / p" />:
            </p>
            <div className="bg-black/20 py-8 px-4 rounded-3xl border border-white/5 mb-10 italic text-blue-300/80">
              <BlockMath math="H_{spec} = -\frac{1}{\ln p} \sum_{i=1}^p \tilde{\lambda}_i \ln \tilde{\lambda}_i" />
            </div>
            <p className="text-white/70 leading-relaxed text-lg">
              If <InlineMath math="H_{spec} \approx 1" />, variance is perfectly distributed (white noise). If <InlineMath math="H_{spec} \to 0" />, the market is collapsing into a single systemic risk factor (PC1 Dominance / Crisis).
            </p>
          </MathSection>

          <MathSection title="10. Markovian Transition Dynamics" subtitle="Step 16: Regime Probabilities & Chapman-Kolmogorov" icon={Network}>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              We model the sequence of detected regimes <InlineMath math="\{S_t\}" /> as a discrete-time Markov Chain. We estimate the maximum likelihood transition probabilities <InlineMath math="P_{ij}" />:
            </p>
            <div className="bg-black/40 py-8 px-4 rounded-3xl border border-white/5 mb-8 shadow-inner">
              <BlockMath math="P(S_{t+1} = j \mid S_t = i) = P_{ij} = \frac{N_{i \to j}}{\sum_{k} N_{i \to k}}" />
            </div>
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              To forecast the probability of the market being in state <InlineMath math="j" /> after <InlineMath math="m" /> days, we utilize the <strong>Chapman-Kolmogorov equation</strong>, raising the transition matrix <InlineMath math="P" /> to the <InlineMath math="m" />-th power:
            </p>
            <div className="bg-black/20 py-8 px-4 rounded-3xl border border-white/5 mb-8 italic text-blue-300/80">
              <BlockMath math="P(S_{t+m} = j \mid S_t = i) = (P^m)_{ij}" />
            </div>
            <p className="text-white/70 leading-relaxed text-lg">
              Finally, we calculate the stationary distribution <InlineMath math="\pi" /> satisfying <InlineMath math="\pi P = \pi" />, which gives the long-run unconditional probability of existing in a Trend, Range, Crisis, or Shock regime over infinite time.
            </p>
          </MathSection>

          {/* Research References Section */}
          <section className="mt-40 border-t border-white/10 pt-20">
            <div className="flex items-center gap-4 mb-12">
              <BookOpen className="text-blue-400" size={32} />
              <h3 className="text-3xl font-bold text-white">Academic Bibliography & External Links</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              
              <a href="https://link.springer.com/book/10.1007/b98835" target="_blank" rel="noreferrer" className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-blue-400 font-bold text-lg mb-2 group-hover:text-blue-300">Jolliffe, I.T. (2002)</h4>
                    <p className="text-lg text-white/70 italic mb-3">"Principal Component Analysis, Second Edition." Springer Series in Statistics.</p>
                    <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-mono">Foundational mathematical textbook for Steps 1 through 7 (Standardization & Lagrangian optimization).</p>
                  </div>
                  <ArrowRightLeft className="text-white/10 group-hover:text-blue-500/50" />
                </div>
              </a>

              <a href="https://www.jstor.org/stable/2938361" target="_blank" rel="noreferrer" className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-blue-400 font-bold text-lg mb-2 group-hover:text-blue-300">Hamilton, J.D. (1989)</h4>
                    <p className="text-lg text-white/70 italic mb-3">"A New Approach to the Economic Analysis of Nonstationary Time Series." Econometrica.</p>
                    <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-mono">Theoretical justification for Step 2 and 10 (Stationarity constraints and Markov-Switching modeling).</p>
                  </div>
                  <ArrowRightLeft className="text-white/10 group-hover:text-blue-500/50" />
                </div>
              </a>

              <a href="https://www.jstor.org/stable/2692226" target="_blank" rel="noreferrer" className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-blue-400 font-bold text-lg mb-2 group-hover:text-blue-300">Bai, J., & Ng, S. (2002)</h4>
                    <p className="text-lg text-white/70 italic mb-3">"Determining the Number of Factors in Approximate Factor Models." Econometrica.</p>
                    <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-mono">Econometric proof for Step 6 (Truncating the eigenspace dimensionality based on information criteria).</p>
                  </div>
                  <ArrowRightLeft className="text-white/10 group-hover:text-blue-500/50" />
                </div>
              </a>

              <a href="https://arxiv.org/abs/0910.1205" target="_blank" rel="noreferrer" className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-blue-400 font-bold text-lg mb-2 group-hover:text-blue-300">Bouchaud, J.P., & Potters, M. (2009)</h4>
                    <p className="text-lg text-white/70 italic mb-3">"Financial Applications of Random Matrix Theory: A Short Review."</p>
                    <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-mono">Basis for Step 9 (Spectral Entropy, Marchenko-Pastur distribution, and distinguishing signal from noise).</p>
                  </div>
                  <ArrowRightLeft className="text-white/10 group-hover:text-blue-500/50" />
                </div>
              </a>

              <a href="https://www.ssrn.com/abstract=1150117" target="_blank" rel="noreferrer" className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-blue-400 font-bold text-lg mb-2 group-hover:text-blue-300">Avellaneda, M., & Lee, J.H. (2008)</h4>
                    <p className="text-lg text-white/70 italic mb-3">"Statistical Arbitrage in the US Equities Market." Quantitative Finance.</p>
                    <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-mono">Industry standard application for PCA factor extraction and dynamic Beta hedging.</p>
                  </div>
                  <ArrowRightLeft className="text-white/10 group-hover:text-blue-500/50" />
                </div>
              </a>

            </div>
          </section>

        </div>

        <footer className="mt-40 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-white/10 text-[10px] font-mono tracking-[0.5em] uppercase">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-white/10" />
            <span>PhD Quantitative Pipeline Architecture</span>
          </div>
          <span>© 2026 Advanced Macro Analytics</span>
        </footer>
      </div>
    </div>
  );
};

export default MathProofs;
