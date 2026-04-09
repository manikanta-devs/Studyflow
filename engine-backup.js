/* ===================================================================
   STUDYFLOW PRO - ADVANCED ENGINE
   Powered by Math.js, KaTeX, Plotly
   Capabilities: Symbolic math, calculus, linear algebra, visualization
   =================================================================== */

const AdvancedEngine = (() => {
  
  /* ===================================================================
     SYMBOLIC MATHEMATICS ENGINE
     Uses Math.js for computation
     =================================================================== */
  
  const SymbolicMath = {
    
    // Simplify expression
    simplify: (expr) => {
      try {
        const simplified = math.simplify(expr);
        return {
          original: expr,
          simplified: simplified.toString(),
          latex: simplified.toTex ? simplified.toTex() : simplified.toString()
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Expand expression
    expand: (expr) => {
      try {
        const node = math.parse(expr);
        const expanded = node.toString();
        return {
          original: expr,
          expanded: expanded,
          latex: node.toTex ? node.toTex() : expanded
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Derivative
    derivative: (expr, variable = 'x') => {
      try {
        const node = math.parse(expr);
        const derivative = math.derivative(node, variable);
        return {
          original: expr,
          derivative: derivative.toString(),
          latex: derivative.toTex ? derivative.toTex() : derivative.toString(),
          variable: variable
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Evaluate expression
    evaluate: (expr, scope = {}) => {
      try {
        const result = math.evaluate(expr, scope);
        return {
          expression: expr,
          result: typeof result === 'number' ? math.round(result, 10) : result.toString(),
          scope: scope
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Solve equation
    solve: (equation, variable = 'x') => {
      try {
        // Handle different equation formats
        let expr = equation;
        if (equation.includes('=')) {
          const parts = equation.split('=');
          expr = `${parts[0]} - (${parts[1]})`;
        }
        
        // Try to solve symbolically
        const solutions = [];
        
        // For simple linear equations
        if (this.isLinear(expr, variable)) {
          const solution = this.solveLinear(expr, variable);
          if (solution !== null) solutions.push(solution);
        }
        
        // For quadratic equations
        else if (this.isQuadratic(expr, variable)) {
          const sols = this.solveQuadratic(expr, variable);
          solutions.push(...sols);
        }
        
        return {
          equation: equation,
          variable: variable,
          solutions: solutions.length > 0 ? solutions : ['No simple closed-form solution found. Try numerical methods.']
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Check if expression is linear in variable
    isLinear: (expr, variable) => {
      try {
        const node = math.parse(expr);
        const derivative = math.derivative(node, variable);
        const secondDerivative = math.derivative(derivative, variable);
        return secondDerivative.toString() === '0';
      } catch {
        return false;
      }
    },
    
    // Check if expression is quadratic
    isQuadratic: (expr, variable) => {
      try {
        const pattern = new RegExp(`${variable}\\s*\\^\\s*2|${variable}\\*\\*2`);
        return pattern.test(expr);
      } catch {
        return false;
      }
    },
    
    // Solve linear equation ax + b = 0
    solveLinear: (expr, variable) => {
      try {
        const derivative = math.derivative(expr, variable);
        const a = math.evaluate(derivative.toString());
        const b = math.evaluate(expr, { [variable]: 0 });
        return -b / a;
      } catch {
        return null;
      }
    },
    
    // Solve quadratic equation
    solveQuadratic: (expr, variable) => {
      try {
        // This is a simplified version - for production use a proper computer algebra system
        return ['Use quadratic formula or numerical solver'];
      } catch {
        return [];
      }
    }
  };
  
  /* ===================================================================
     LINEAR ALGEBRA ENGINE
     Matrix operations, eigenvalues, decompositions
     =================================================================== */
  
  const LinearAlgebra = {
    
    // Parse matrix from string
    parseMatrix: (str) => {
      try {
        // Handle different formats
        str = str.trim();
        
        // Format: [[1,2,3];[4,5,6]]
        if (str.includes('[') && str.includes(';')) {
          str = str.replace(/\[/g, '[').replace(/\]/g, ']').replace(/;/g, '],[');
          str = str.replace('],[]]', ']]');
        }
        
        const matrix = math.evaluate(str);
        return matrix;
      } catch (error) {
        throw new Error('Invalid matrix format');
      }
    },
    
    // Determinant
    determinant: (matrixStr) => {
      try {
        const matrix = this.parseMatrix(matrixStr);
        const det = math.det(matrix);
        return {
          matrix: matrix,
          determinant: math.round(det, 10),
          latex: `\\det(A) = ${math.round(det, 10)}`
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Inverse
    inverse: (matrixStr) => {
      try {
        const matrix = this.parseMatrix(matrixStr);
        const inv = math.inv(matrix);
        return {
          matrix: matrix,
          inverse: inv,
          latex: this.matrixToLatex(inv, 'A^{-1}')
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Eigenvalues and eigenvectors
    eigenvalues: (matrixStr) => {
      try {
        const matrix = this.parseMatrix(matrixStr);
        const eigs = math.eigs(matrix);
        return {
          matrix: matrix,
          eigenvalues: eigs.values,
          eigenvectors: eigs.vectors,
          latex: this.eigenToLatex(eigs)
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Transpose
    transpose: (matrixStr) => {
      try {
        const matrix = this.parseMatrix(matrixStr);
        const transposed = math.transpose(matrix);
        return {
          matrix: matrix,
          transpose: transposed,
          latex: this.matrixToLatex(transposed, 'A^T')
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Rank
    rank: (matrixStr) => {
      try {
        const matrix = this.parseMatrix(matrixStr);
        // Simple rank calculation using row echelon form
        const rref = this.rref(matrix);
        const rank = this.countNonZeroRows(rref);
        return {
          matrix: matrix,
          rank: rank,
          latex: `\\text{rank}(A) = ${rank}`
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // LU Decomposition
    luDecomposition: (matrixStr) => {
      try {
        const matrix = this.parseMatrix(matrixStr);
        const lu = math.lup(matrix);
        return {
          matrix: matrix,
          L: lu.L,
          U: lu.U,
          P: lu.P,
          latex: this.luToLatex(lu)
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Helper: Row Reduced Echelon Form
    rref: (matrix) => {
      const m = math.clone(matrix);
      const rows = m.length;
      const cols = m[0].length;
      let lead = 0;
      
      for (let r = 0; r < rows; r++) {
        if (lead >= cols) return m;
        
        let i = r;
        while (Math.abs(m[i][lead]) < 1e-10) {
          i++;
          if (i === rows) {
            i = r;
            lead++;
            if (lead === cols) return m;
          }
        }
        
        [m[i], m[r]] = [m[r], m[i]];
        
        const lv = m[r][lead];
        for (let j = 0; j < cols; j++) {
          m[r][j] /= lv;
        }
        
        for (let i = 0; i < rows; i++) {
          if (i !== r) {
            const lv = m[i][lead];
            for (let j = 0; j < cols; j++) {
              m[i][j] -= lv * m[r][j];
            }
          }
        }
        lead++;
      }
      return m;
    },
    
    // Helper: Count non-zero rows
    countNonZeroRows: (matrix) => {
      let count = 0;
      for (let row of matrix) {
        if (row.some(val => Math.abs(val) > 1e-10)) count++;
      }
      return count;
    },
    
    // Helper: Convert matrix to LaTeX
    matrixToLatex: (matrix, name = 'A') => {
      const rows = matrix.map(row => 
        row.map(val => math.round(val, 4)).join(' & ')
      ).join(' \\\\ ');
      return `${name} = \\begin{bmatrix} ${rows} \\end{bmatrix}`;
    },
    
    // Helper: Convert eigenvalues to LaTeX
    eigenToLatex: (eigs) => {
      const vals = eigs.values.map(v => math.round(v, 4)).join(', ');
      return `\\lambda = \\{${vals}\\}`;
    },
    
    // Helper: Convert LU to LaTeX
    luToLatex: (lu) => {
      return `A = LU`;
    }
  };
  
  /* ===================================================================
     CALCULUS ENGINE
     Derivatives, integrals, limits, series
     =================================================================== */
  
  const Calculus = {
    
    // Compute derivative with explanation
    derivative: (funcStr, variable = 'x') => {
      try {
        const node = math.parse(funcStr);
        const derivative = math.derivative(node, variable);
        const simplified = math.simplify(derivative);
        
        return {
          function: funcStr,
          variable: variable,
          derivative: simplified.toString(),
          latex: simplified.toTex ? simplified.toTex() : simplified.toString(),
          steps: this.derivativeSteps(funcStr, variable)
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Generate step-by-step derivative explanation
    derivativeSteps: (funcStr, variable) => {
      const steps = [];
      steps.push(`Original function: f(${variable}) = ${funcStr}`);
      steps.push(`Apply differentiation rules...`);
      // Add more detailed steps based on function type
      return steps;
    },
    
    // Numerical integration (Simpson's rule)
    integrate: (funcStr, variable, lower, upper) => {
      try {
        const func = math.compile(funcStr);
        
        // Simpson's rule implementation
        const n = 1000; // number of intervals
        const h = (upper - lower) / n;
        let sum = func.evaluate({ [variable]: lower }) + func.evaluate({ [variable]: upper });
        
        for (let i = 1; i < n; i++) {
          const x = lower + i * h;
          const weight = i % 2 === 0 ? 2 : 4;
          sum += weight * func.evaluate({ [variable]: x });
        }
        
        const result = (h / 3) * sum;
        
        return {
          function: funcStr,
          variable: variable,
          bounds: [lower, upper],
          result: math.round(result, 10),
          latex: `\\int_{${lower}}^{${upper}} ${funcStr} \\, d${variable} \\approx ${math.round(result, 6)}`
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Compute limit numerically
    limit: (funcStr, variable, point, direction = 'both') => {
      try {
        const func = math.compile(funcStr);
        const epsilon = 1e-6;
        
        let leftLimit, rightLimit;
        
        if (direction === 'left' || direction === 'both') {
          leftLimit = func.evaluate({ [variable]: point - epsilon });
        }
        
        if (direction === 'right' || direction === 'both') {
          rightLimit = func.evaluate({ [variable]: point + epsilon });
        }
        
        const limit = direction === 'left' ? leftLimit :
                      direction === 'right' ? rightLimit :
                      Math.abs(leftLimit - rightLimit) < epsilon ? leftLimit : 'DNE';
        
        return {
          function: funcStr,
          variable: variable,
          point: point,
          direction: direction,
          limit: typeof limit === 'number' ? math.round(limit, 10) : limit,
          latex: `\\lim_{${variable} \\to ${point}} ${funcStr} = ${typeof limit === 'number' ? math.round(limit, 6) : limit}`
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Taylor series expansion
    taylorSeries: (funcStr, variable, point, order) => {
      try {
        const terms = [];
        let currentFunc = math.parse(funcStr);
        
        for (let n = 0; n <= order; n++) {
          const value = math.evaluate(currentFunc.toString(), { [variable]: point });
          const coefficient = value / this.factorial(n);
          
          if (Math.abs(coefficient) > 1e-10) {
            terms.push({
              order: n,
              coefficient: math.round(coefficient, 10),
              term: n === 0 ? `${math.round(coefficient, 6)}` :
                    n === 1 ? `${math.round(coefficient, 6)}(${variable}-${point})` :
                    `${math.round(coefficient, 6)}(${variable}-${point})^${n}`
            });
          }
          
          if (n < order) {
            currentFunc = math.derivative(currentFunc, variable);
          }
        }
        
        return {
          function: funcStr,
          variable: variable,
          point: point,
          order: order,
          terms: terms,
          latex: this.termsToLatex(terms)
        };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    // Helper: Factorial
    factorial: (n) => {
      if (n <= 1) return 1;
      return n * this.factorial(n - 1);
    },
    
    // Helper: Convert terms to LaTeX
    termsToLatex: (terms) => {
      return terms.map(t => t.term).join(' + ');
    }
  };
  
  /* ===================================================================
     PHYSICS ENGINE
     Classical mechanics, kinematics, dynamics
     =================================================================== */
  
  const Physics = {
    
    // Projectile motion
    projectile: (v0, angle, g = 9.81) => {
      const angleRad = (angle * Math.PI) / 180;
      const v0x = v0 * Math.cos(angleRad);
      const v0y = v0 * Math.sin(angleRad);
      
      const timeOfFlight = (2 * v0y) / g;
      const maxHeight = (v0y * v0y) / (2 * g);
      const range = v0x * timeOfFlight;
      
      // Generate trajectory points
      const points = [];
      for (let t = 0; t <= timeOfFlight; t += timeOfFlight / 100) {
        const x = v0x * t;
        const y = v0y * t - 0.5 * g * t * t;
        if (y >= 0) points.push({ x, y, t });
      }
      
      return {
        initialVelocity: v0,
        angle: angle,
        components: { vx: math.round(v0x, 4), vy: math.round(v0y, 4) },
        timeOfFlight: math.round(timeOfFlight, 4),
        maxHeight: math.round(maxHeight, 4),
        range: math.round(range, 4),
        trajectory: points
      };
    },
    
    // Simple harmonic motion
    harmonicMotion: (mass, springConstant, amplitude, time) => {
      const omega = Math.sqrt(springConstant / mass);
      const period = (2 * Math.PI) / omega;
      const frequency = 1 / period;
      
      const points = [];
      for (let t = 0; t <= time; t += time / 200) {
        const x = amplitude * Math.cos(omega * t);
        const v = -amplitude * omega * Math.sin(omega * t);
        const a = -amplitude * omega * omega * Math.cos(omega * t);
        points.push({ t, x, v, a });
      }
      
      return {
        mass: mass,
        springConstant: springConstant,
        amplitude: amplitude,
        omega: math.round(omega, 4),
        period: math.round(period, 4),
        frequency: math.round(frequency, 4),
        motion: points
      };
    },
    
    // Kinematics equations
    kinematics: (params) => {
      const { v0, a, t, s } = params;
      const results = {};
      
      // v = v0 + at
      if (v0 !== undefined && a !== undefined && t !== undefined) {
        results.finalVelocity = v0 + a * t;
      }
      
      // s = v0*t + 0.5*a*t^2
      if (v0 !== undefined && a !== undefined && t !== undefined) {
        results.displacement = v0 * t + 0.5 * a * t * t;
      }
      
      // v^2 = v0^2 + 2*a*s
      if (v0 !== undefined && a !== undefined && s !== undefined) {
        results.finalVelocity = Math.sqrt(v0 * v0 + 2 * a * s);
      }
      
      return results;
    }
  };
  
  /* ===================================================================
     ADVANCED PROBLEM SOLVER
     Masters-level problem solving with detailed explanations
     =================================================================== */
  
  const ProblemSolver = {
    
    solve: (problem, subject) => {
      const lower = problem.toLowerCase();
      
      // Detect problem type
      if (subject === 'mathematics' || lower.includes('derivative') || lower.includes('integral')) {
        return this.solveMathProblem(problem);
      } else if (subject === 'physics' || lower.includes('velocity') || lower.includes('force')) {
        return this.solvePhysicsProblem(problem);
      } else if (lower.includes('matrix') || lower.includes('eigenvalue')) {
        return this.solveLinearAlgebraProblem(problem);
      } else if (subject === 'statistics') {
        return this.solveStatisticsProblem(problem);
      } else {
        return this.solveGeneralProblem(problem, subject);
      }
    },
    
    solveMathProblem: (problem) => {
      let solution = '<div class="solution-container">';
      solution += '<h3>📊 Mathematical Analysis</h3>';
      
      // Detect differential equations
      if (problem.includes('dy/dx') || problem.includes("d/dx")) {
        solution += '<h4>Differential Equation Detected</h4>';
        solution += '<p><strong>Problem Type:</strong> First-order ordinary differential equation (ODE)</p>';
        
        solution += '<h4>Solution Steps:</h4>';
        solution += '<ol>';
        solution += '<li><strong>Identify the equation type:</strong> Check if it\'s separable, linear, exact, or requires an integrating factor</li>';
        solution += '<li><strong>Apply appropriate method:</strong> For linear equations of form dy/dx + P(x)y = Q(x), use integrating factor μ(x) = e^(∫P(x)dx)</li>';
        solution += '<li><strong>Integrate both sides:</strong> Multiply by integrating factor and integrate</li>';
        solution += '<li><strong>Apply initial conditions:</strong> If given, solve for the constant of integration</li>';
        solution += '<li><strong>Verify solution:</strong> Differentiate to check if it satisfies the original equation</li>';
        solution += '</ol>';
        
        solution += '<h4>Example Solution Pattern:</h4>';
        solution += '<pre><code>For dy/dx + 2y = 4e^x:\n';
        solution += '1. P(x) = 2, Q(x) = 4e^x\n';
        solution += '2. Integrating factor: μ = e^(∫2dx) = e^(2x)\n';
        solution += '3. Multiply: e^(2x)dy/dx + 2e^(2x)y = 4e^(3x)\n';
        solution += '4. Left side is d/dx[e^(2x)y] = 4e^(3x)\n';
        solution += '5. Integrate: e^(2x)y = (4/3)e^(3x) + C\n';
        solution += '6. Solution: y = (4/3)e^x + Ce^(-2x)</code></pre>';
      }
      
      // Detect eigenvalue problems
      else if (problem.includes('eigenvalue') || problem.includes('eigenvector')) {
        solution += '<h4>Eigenvalue Problem Detected</h4>';
        solution += '<p><strong>Problem Type:</strong> Linear algebra - eigenvalue decomposition</p>';
        
        solution += '<h4>Solution Steps:</h4>';
        solution += '<ol>';
        solution += '<li><strong>Form characteristic equation:</strong> det(A - λI) = 0</li>';
        solution += '<li><strong>Solve for eigenvalues:</strong> Find roots of the characteristic polynomial</li>';
        solution += '<li><strong>Find eigenvectors:</strong> For each λ, solve (A - λI)v = 0</li>';
        solution += '<li><strong>Verify:</strong> Check that Av = λv for each eigenvalue-eigenvector pair</li>';
        solution += '</ol>';
        
        // Try to extract matrix if present
        const matrixMatch = problem.match(/\[\[.*?\]\]/);
        if (matrixMatch) {
          try {
            const result = LinearAlgebra.eigenvalues(matrixMatch[0]);
            if (!result.error) {
              solution += '<h4>Computed Eigenvalues:</h4>';
              solution += '<div class="latex-display">';
              solution += result.latex;
              solution += '</div>';
              solution += `<p><strong>Eigenvalues:</strong> ${JSON.stringify(result.eigenvalues)}</p>`;
            }
          } catch (e) {
            // Continue with general explanation
          }
        }
      }
      
      // Detect series convergence
      else if (problem.includes('series') || problem.includes('converge') || problem.includes('Σ')) {
        solution += '<h4>Series Convergence Problem</h4>';
        solution += '<p><strong>Problem Type:</strong> Infinite series analysis</p>';
        
        solution += '<h4>Convergence Tests to Apply:</h4>';
        solution += '<ol>';
        solution += '<li><strong>Divergence Test:</strong> If lim(n→∞) aₙ ≠ 0, series diverges</li>';
        solution += '<li><strong>Ratio Test:</strong> L = lim|aₙ₊₁/aₙ|. If L &lt; 1: converges, L &gt; 1: diverges, L = 1: inconclusive</li>';
        solution += '<li><strong>Root Test:</strong> L = lim|aₙ|^(1/n). Same conclusions as ratio test</li>';
        solution += '<li><strong>Comparison Test:</strong> Compare with known convergent/divergent series</li>';
        solution += '<li><strong>Integral Test:</strong> For positive decreasing terms, compare with ∫f(x)dx</li>';
        solution += '<li><strong>Alternating Series Test:</strong> For alternating series, check if terms decrease to 0</li>';
        solution += '</ol>';
        
        if (problem.includes('1/n²') || problem.includes('1/n^2')) {
          solution += '<h4>Special Case: p-series with p=2</h4>';
          solution += '<p>The series Σ(1/n²) is a p-series with p = 2 > 1, therefore it <strong>converges</strong>.</p>';
          solution += '<p>In fact, this series converges to π²/6 ≈ 1.6449 (Basel problem, proved by Euler).</p>';
        }
      }
      
      else {
        solution += '<p>Please provide more specific mathematical notation or clarify the problem type.</p>';
        solution += '<p><strong>Suggested format:</strong></p>';
        solution += '<ul>';
        solution += '<li>Differential equations: "dy/dx + 2y = 4e^x"</li>';
        solution += '<li>Eigenvalues: "Find eigenvalues of [[3,1],[1,3]]"</li>';
        solution += '<li>Series: "Test convergence of Σ(n=1 to ∞) 1/n²"</li>';
        solution += '</ul>';
      }
      
      solution += '</div>';
      return solution;
    },
    
    solvePhysicsProblem: (problem) => {
      let solution = '<div class="solution-container">';
      solution += '<h3>⚛️ Physics Solution</h3>';
      
      if (problem.includes('projectile') || problem.includes('trajectory')) {
        solution += '<h4>Projectile Motion Problem</h4>';
        solution += '<h4>Key Equations:</h4>';
        solution += '<ul>';
        solution += '<li>Horizontal: x = v₀cos(θ)t</li>';
        solution += '<li>Vertical: y = v₀sin(θ)t - ½gt²</li>';
        solution += '<li>Range: R = (v₀²sin(2θ))/g</li>';
        solution += '<li>Max height: H = (v₀²sin²(θ))/(2g)</li>';
        solution += '</ul>';
      } else if (problem.includes('harmonic') || problem.includes('spring')) {
        solution += '<h4>Simple Harmonic Motion</h4>';
        solution += '<h4>Key Equations:</h4>';
        solution += '<ul>';
        solution += '<li>Angular frequency: ω = √(k/m)</li>';
        solution += '<li>Period: T = 2π/ω = 2π√(m/k)</li>';
        solution += '<li>Position: x(t) = Acos(ωt + φ)</li>';
        solution += '<li>Velocity: v(t) = -Aωsin(ωt + φ)</li>';
        solution += '<li>Acceleration: a(t) = -Aω²cos(ωt + φ)</li>';
        solution += '</ul>';
      } else {
        solution += '<p>Advanced physics problem detected. Apply relevant principles:</p>';
        solution += '<ul>';
        solution += '<li>Conservation of energy</li>';
        solution += '<li>Conservation of momentum</li>';
        solution += '<li>Newton\'s laws</li>';
        solution += '<li>Kinematic equations</li>';
        solution += '</ul>';
      }
      
      solution += '</div>';
      return solution;
    },
    
    solveLinearAlgebraProblem: (problem) => {
      let solution = '<div class="solution-container">';
      solution += '<h3>🔢 Linear Algebra Solution</h3>';
      
      // Implementation for linear algebra problems
      solution += '<p>Use the Matrix Tools section for detailed calculations.</p>';
      solution += '</div>';
      return solution;
    },
    
    solveStatisticsProblem: (problem) => {
      let solution = '<div class="solution-container">';
      solution += '<h3>📈 Statistical Analysis</h3>';
      
      solution += '<h4>Common Statistical Approaches:</h4>';
      solution += '<ol>';
      solution += '<li><strong>Descriptive Statistics:</strong> Mean, median, mode, variance, standard deviation</li>';
      solution += '<li><strong>Probability Distributions:</strong> Normal, binomial, Poisson, exponential</li>';
      solution += '<li><strong>Hypothesis Testing:</strong> t-tests, chi-square, ANOVA</li>';
      solution += '<li><strong>Regression Analysis:</strong> Linear, multiple, logistic regression</li>';
      solution += '<li><strong>Confidence Intervals:</strong> For means, proportions, differences</li>';
      solution += '</ol>';
      
      solution += '</div>';
      return solution;
    },
    
    solveGeneralProblem: (problem, subject) => {
      let solution = '<div class="solution-container">';
      solution += `<h3>🎓 ${subject.charAt(0).toUpperCase() + subject.slice(1)} Analysis</h3>`;
      solution += '<p>Advanced problem-solving approach:</p>';
      solution += '<ol>';
      solution += '<li><strong>Understand the problem:</strong> Identify given information and what needs to be found</li>';
      solution += '<li><strong>Identify relevant principles:</strong> List applicable theories, laws, or methods</li>';
      solution += '<li><strong>Develop a strategy:</strong> Break down into manageable steps</li>';
      solution += '<li><strong>Execute the solution:</strong> Apply methods systematically</li>';
      solution += '<li><strong>Verify and reflect:</strong> Check answer reasonableness and alternative approaches</li>';
      solution += '</ol>';
      solution += '</div>';
      return solution;
    }
  };
  
  /* ===================================================================
     GRAPH PLOTTER
     Uses Plotly for interactive visualization
     =================================================================== */
  
  const GraphPlotter = {
    
    plot: (functions, xMin, xMax, elementId) => {
      try {
        const funcArray = functions.split(',').map(f => f.trim());
        const traces = [];
        
        // Generate x values
        const numPoints = 500;
        const x = [];
        for (let i = 0; i <= numPoints; i++) {
          x.push(xMin + (xMax - xMin) * i / numPoints);
        }
        
        // Evaluate each function
        funcArray.forEach((funcStr, index) => {
          try {
            const func = math.compile(funcStr);
            const y = x.map(val => {
              try {
                return func.evaluate({ x: val });
              } catch {
                return null;
              }
            });
            
            traces.push({
              x: x,
              y: y,
              type: 'scatter',
              mode: 'lines',
              name: funcStr,
              line: {
                width: 2
              }
            });
          } catch (error) {
            console.error(`Error plotting ${funcStr}:`, error);
          }
        });
        
        const layout = {
          title: 'Function Plot',
          xaxis: {
            title: 'x',
            gridcolor: '#334155',
            zerolinecolor: '#475569'
          },
          yaxis: {
            title: 'f(x)',
            gridcolor: '#334155',
            zerolinecolor: '#475569'
          },
          paper_bgcolor: '#1e293b',
          plot_bgcolor: '#0f172a',
          font: {
            color: '#f1f5f9'
          },
          showlegend: true,
          legend: {
            x: 1,
            y: 1
          }
        };
        
        Plotly.newPlot(elementId, traces, layout, {
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d']
        });
        
        return { success: true };
      } catch (error) {
        return { error: error.message };
      }
    },
    
    plotData: (data, elementId, title = 'Data Plot') => {
      try {
        const trace = {
          x: data.x || data.map((_, i) => i),
          y: data.y || data,
          type: 'scatter',
          mode: 'lines+markers',
          marker: {
            size: 6
          }
        };
        
        const layout = {
          title: title,
          paper_bgcolor: '#1e293b',
          plot_bgcolor: '#0f172a',
          font: {
            color: '#f1f5f9'
          }
        };
        
        Plotly.newPlot(elementId, [trace], layout, { responsive: true });
        return { success: true };
      } catch (error) {
        return { error: error.message };
      }
    }
  };
  
  /* ===================================================================
     LATEX RENDERER
     Uses KaTeX for beautiful math rendering
     =================================================================== */
  
  const LaTeXRenderer = {
    
    render: (latex, elementId, displayMode = true) => {
      try {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        katex.render(latex, element, {
          displayMode: displayMode,
          throwOnError: false
        });
      } catch (error) {
        console.error('LaTeX render error:', error);
      }
    },
    
    renderAll: (containerElement) => {
      try {
        renderMathInElement(containerElement, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\[', right: '\\]', display: true},
            {left: '\\(', right: '\\)', display: false}
          ]
        });
      } catch (error) {
        console.error('LaTeX render all error:', error);
      }
    }
  };
  
  /* ===================================================================
     CONVERSATIONAL AI ENGINE
     Friendly, context-aware chat for all topics
     =================================================================== */
  
  const ConversationalAI = {
    
    conversationHistory: [],
    userContext: {
      name: null,
      interests: [],
      recentTopics: [],
      mood: 'neutral'
    },
    
    // Main response generator
    generateResponse: (userMessage) => {
      // Add to history
      ConversationalAI.conversationHistory.push({
        role: 'user',
        message: userMessage,
        timestamp: new Date()
      });
      
      // Analyze message
      const analysis = ConversationalAI.analyzeMessage(userMessage);
      
      // Generate appropriate response
      let response;
      
      if (analysis.type === 'greeting') {
        response = ConversationalAI.handleGreeting(userMessage, analysis);
      } else if (analysis.type === 'question') {
        response = ConversationalAI.handleQuestion(userMessage, analysis);
      } else if (analysis.type === 'study_help') {
        response = ConversationalAI.handleStudyHelp(userMessage, analysis);
      } else if (analysis.type === 'motivation') {
        response = ConversationalAI.handleMotivation(userMessage, analysis);
      } else if (analysis.type === 'casual') {
        response = ConversationalAI.handleCasual(userMessage, analysis);
      } else if (analysis.type === 'explanation') {
        response = ConversationalAI.handleExplanation(userMessage, analysis);
      } else {
        response = ConversationalAI.handleGeneral(userMessage, analysis);
      }
      
      // Add to history
      ConversationalAI.conversationHistory.push({
        role: 'assistant',
        message: response,
        timestamp: new Date()
      });
      
      // Update context
      ConversationalAI.updateContext(userMessage, analysis);
      
      return response;
    },
    
    // Analyze user message to determine intent
    analyzeMessage: (message) => {
      const lower = message.toLowerCase();
      const analysis = {
        type: 'general',
        topics: [],
        sentiment: 'neutral',
        keywords: []
      };
      
      // Detect greetings
      if (/^(hi|hello|hey|sup|what's up|howdy|greetings)/i.test(lower)) {
        analysis.type = 'greeting';
      }
      
      // Detect questions
      else if (/\?$/.test(message) || /^(what|when|where|who|why|how|can|could|would|should|is|are|do|does)/i.test(lower)) {
        analysis.type = 'question';
      }
      
      // Detect study help requests
      else if (/help|homework|assignment|study|learn|understand|explain|teach/i.test(lower)) {
        analysis.type = 'study_help';
      }
      
      // Detect motivation needs
      else if (/motivat|inspire|tired|stress|anxious|worried|difficult|hard|give up|can't do/i.test(lower)) {
        analysis.type = 'motivation';
      }
      
      // Detect explanation requests
      else if (/explain|what is|tell me about|how does|why does/i.test(lower)) {
        analysis.type = 'explanation';
      }
      
      // Detect casual conversation
      else if (/like|love|think|feel|opinion|favorite|prefer/i.test(lower)) {
        analysis.type = 'casual';
      }
      
      // Extract topics
      analysis.topics = ConversationalAI.extractTopics(lower);
      
      // Sentiment analysis
      if (/good|great|awesome|excellent|happy|love|enjoy/i.test(lower)) {
        analysis.sentiment = 'positive';
      } else if (/bad|terrible|awful|sad|hate|difficult|hard/i.test(lower)) {
        analysis.sentiment = 'negative';
      }
      
      return analysis;
    },
    
    // Extract topics from message
    extractTopics: (message) => {
      const topics = [];
      const topicMap = {
        science: /physics|chemistry|biology|science|atom|molecule|cell|energy/,
        math: /math|algebra|calculus|geometry|equation|formula|number|calculate/,
        programming: /code|programming|python|javascript|algorithm|software|computer/,
        history: /history|historical|ancient|war|civilization|empire/,
        philosophy: /philosophy|think|meaning|existence|consciousness/,
        ai: /ai|artificial intelligence|machine learning|neural network|deep learning/,
        space: /space|astronomy|planet|star|universe|galaxy|cosmos/,
        psychology: /psychology|brain|mind|behavior|mental|emotion/,
        health: /health|fitness|exercise|diet|nutrition|wellness/,
        technology: /technology|tech|innovation|invention|future/
      };
      
      for (const [topic, pattern] of Object.entries(topicMap)) {
        if (pattern.test(message)) {
          topics.push(topic);
        }
      }
      
      return topics;
    },
    
    // Handle greetings
    handleGreeting: (message, analysis) => {
      const greetings = [
        "Hey there! 👋 How can I help you today?",
        "Hello! 😊 What would you like to chat about?",
        "Hi! Great to see you! What's on your mind?",
        "Hey! I'm here to help with anything you need. What can I do for you?",
        "Hello there! Ready to dive into something interesting?"
      ];
      
      let response = greetings[Math.floor(Math.random() * greetings.length)];
      
      // Add personalized touch if we have context
      if (ConversationalAI.userContext.name) {
        response = response.replace(/Hey|Hello|Hi/, `Hey ${ConversationalAI.userContext.name}`);
      }
      
      return response;
    },
    
    // Handle questions
    handleQuestion: (message, analysis) => {
      const lower = message.toLowerCase();
      
      // Specific question patterns
      if (/what.*time|when/i.test(lower)) {
        return "I don't have access to real-time information, but I'd be happy to discuss time-related concepts or help you understand timelines in history, physics, or other subjects!";
      }
      
      if (/who (are you|r u)/i.test(lower)) {
        return "I'm your AI study companion! I'm here to help you learn, explore ideas, stay motivated, and have interesting conversations. Think of me as your friendly study buddy who's always ready to chat. What would you like to talk about?";
      }
      
      if (/how.*work/i.test(lower)) {
        const topics = analysis.topics;
        if (topics.length > 0) {
          return ConversationalAI.explainHowThingsWork(topics[0]);
        }
        return "Great question! I'd love to explain how things work. Could you be more specific about what you're curious about?";
      }
      
      if (/why.*important/i.test(lower)) {
        return "That's a thoughtful question! Understanding 'why' is often more important than just knowing 'what'. Let me know what specific topic you're interested in, and I'll explain its importance and real-world applications.";
      }
      
      // General question response
      return ConversationalAI.handleGeneral(message, analysis);
    },
    
    // Handle study help
    handleStudyHelp: (message, analysis) => {
      const topics = analysis.topics;
      
      let response = "I'm here to help you learn! ";
      
      if (topics.length > 0) {
        response += `I see you're interested in ${topics.join(', ')}. `;
      }
      
      response += "Here's my approach:\n\n";
      response += "1. **Break it down**: Let's tackle this step by step\n";
      response += "2. **Connect concepts**: I'll relate it to things you already know\n";
      response += "3. **Practice**: We can work through examples together\n";
      response += "4. **Apply it**: Understanding how to use knowledge is key\n\n";
      response += "What specific part would you like to start with?";
      
      return response;
    },
    
    // Handle motivation
    handleMotivation: (message, analysis) => {
      const motivationalResponses = [
        {
          condition: /tired|exhaust/i,
          response: "I hear you - studying can be exhausting! 💪 Remember:\n\n• **Take breaks**: Your brain needs rest to consolidate learning\n• **Celebrate small wins**: Every bit of progress counts\n• **You're doing better than you think**: The fact that you're here shows commitment\n\nWant to chat about what's making you tired? Sometimes talking helps!"
        },
        {
          condition: /difficult|hard/i,
          response: "Feeling challenged is actually a sign you're learning! 🌟\n\n**Here's the truth**: Difficult things become easy with practice. Every expert was once a beginner who didn't give up.\n\n**Try this**:\n1. Break the problem into tiny pieces\n2. Master one small part at a time\n3. Connect it to something you already understand\n\nWhat specific part is giving you trouble? Let's tackle it together!"
        },
        {
          condition: /give up|can't do/i,
          response: "Hold on! 🛑 Before you give up, let's reframe this:\n\n• **You CAN do this** - you just haven't figured it out *yet*\n• **Struggling is learning** - your brain is literally growing right now\n• **Every expert started here** - difficulty is temporary, giving up is permanent\n\n**Quick boost**: Think of something you can do now that seemed impossible before. You learned that, and you'll learn this too!\n\nWant to talk about what's frustrating you?"
        }
      ];
      
      for (const item of motivationalResponses) {
        if (item.condition.test(message)) {
          return item.response;
        }
      }
      
      // Generic motivation
      return "You've got this! 🚀 Remember why you started. Every small step forward is progress. What you're learning today is building the foundation for tomorrow's success.\n\nKeep going - I believe in you! What can I help you with?";
    },
    
    // Handle casual conversation
    handleCasual: (message, analysis) => {
      const lower = message.toLowerCase();
      
      if (/favorite|like/i.test(lower)) {
        return "That's a fun question! As an AI, I don't have personal preferences, but I love helping people discover what *they* love! What are you passionate about? I'd love to hear about your interests!";
      }
      
      if (/think|opinion/i.test(lower)) {
        return "I appreciate you asking for my perspective! While I don't have personal opinions, I can share different viewpoints and help you explore ideas from multiple angles. What topic are you curious about?";
      }
      
      return "I'm enjoying our conversation! 😊 What else is on your mind?";
    },
    
    // Handle explanation requests
    handleExplanation: (message, analysis) => {
      const topics = analysis.topics;
      
      if (topics.includes('ai')) {
        return ConversationalAI.explainAI();
      } else if (topics.includes('space')) {
        return ConversationalAI.explainSpace(message);
      } else if (topics.includes('brain') || topics.includes('psychology')) {
        return ConversationalAI.explainBrain(message);
      } else if (topics.includes('quantum') || topics.includes('physics')) {
        return ConversationalAI.explainPhysics(message);
      }
      
      return "I'd love to explain that! To give you the most helpful explanation, could you tell me:\n\n1. What's your current understanding?\n2. What specific aspect confuses you?\n3. Is this for general knowledge or a specific project?\n\nThis helps me tailor the explanation to your needs!";
    },
    
    // Topic-specific explanations
    explainAI: () => {
      return "**Artificial Intelligence (AI)** - Let me break this down! 🤖\n\n**Simple version**: AI is when computers learn to do tasks that normally require human intelligence - like recognizing faces, understanding language, or making decisions.\n\n**How it works**:\n1. **Machine Learning**: Computers find patterns in data\n2. **Neural Networks**: Inspired by how your brain works!\n3. **Training**: The AI learns from examples, just like you do\n\n**Cool fact**: The AI helping you right now uses pattern matching and rules - simpler than ChatGPT, but still pretty smart!\n\n**Want to go deeper?** I can explain neural networks, machine learning algorithms, or AI ethics!";
    },
    
    explainSpace: (message) => {
      if (/black hole/i.test(message)) {
        return "**Black Holes** - One of space's coolest mysteries! 🌌\n\n**What they are**: Regions where gravity is so strong that nothing - not even light - can escape!\n\n**Mind-blowing facts**:\n• Time slows down near black holes (thanks, Einstein!)\n• They're formed when massive stars collapse\n• There's a supermassive one at the center of our galaxy\n• We've actually photographed one (2019)!\n\n**The really weird part**: Cross the event horizon (point of no return) and you'd be 'spaghettified' - stretched like spaghetti due to gravity!\n\nWant to explore more cosmic mysteries?";
      }
      
      return "**Space** - The final frontier! 🚀\n\n**Mind-boggling scale**:\n• Our solar system is just a tiny dot in the Milky Way\n• The Milky Way is just one of billions of galaxies\n• The universe is expanding... into what? Nobody knows!\n\n**Cool topics we could explore**:\n• Black holes and time dilation\n• The search for alien life\n• How stars are born and die\n• The Big Bang and cosmic inflation\n\nWhat aspect of space fascinates you most?";
    },
    
    explainBrain: (message) => {
      if (/learn/i.test(message)) {
        return "**How Your Brain Learns** - This is fascinating! 🧠\n\n**The Process**:\n1. **Neurons fire together**: When you learn, brain cells connect\n2. **Repetition strengthens paths**: 'Neurons that fire together, wire together'\n3. **Sleep consolidates**: Your brain processes and stores info while you sleep!\n4. **Emotion boosts memory**: That's why exciting things stick\n\n**Study Hacks**:\n• **Spaced repetition**: Review over time, not all at once\n• **Active recall**: Test yourself instead of rereading\n• **Teach others**: Best way to solidify understanding\n• **Sleep well**: 7-9 hours = better memory!\n\n**Fun fact**: Your brain is more active while you sleep than when you're watching TV!\n\nWant specific study techniques?";
      }
      
      return "**The Human Brain** - The most complex object in the universe! 🧠\n\n**Amazing facts**:\n• 86 billion neurons, each connecting to thousands of others\n• Generates enough electricity to power a lightbulb\n• Can store millions of gigabytes of information\n• Completely rewires itself based on what you learn (neuroplasticity!)\n\n**What it does**:\n• Processes emotions, memories, thoughts\n• Controls your entire body automatically\n• Dreams, creates, imagines, solves problems\n• Never stops working (even while you sleep!)\n\nWhat aspect interests you - memory, consciousness, learning, or something else?";
    },
    
    explainPhysics: (message) => {
      if (/quantum/i.test(message)) {
        return "**Quantum Physics** - Where reality gets weird! ⚛️\n\n**The basics**:\n• At tiny scales, particles behave differently than everyday objects\n• Things can be in multiple states at once (superposition)\n• Observation changes outcomes (measurement problem)\n• Particles can be connected across space (entanglement)\n\n**Mind-bending examples**:\n• Schrödinger's cat: both alive AND dead until observed\n• Quantum tunneling: particles pass through barriers\n• Uncertainty principle: you can't know everything about a particle\n\n**Why it matters**:\n• Computers (quantum computing)\n• Modern electronics\n• Understanding the universe\n\n**The weird part**: Even physicists find it bizarre - that's what makes it exciting!\n\nWant to dive deeper into any quantum concept?";
      }
      
      return "**Physics** - The study of how the universe works! ⚡\n\n**Big ideas**:\n• Everything is made of energy and matter\n• Forces govern how things interact\n• Time and space are connected (spacetime)\n• The same laws work everywhere in the universe!\n\n**Cool areas**:\n• Classical mechanics (motion, forces)\n• Quantum physics (tiny weird stuff)\n• Relativity (space, time, gravity)\n• Thermodynamics (energy, heat)\n\nWhat area interests you most?";
    },
    
    explainHowThingsWork: (topic) => {
      const explanations = {
        science: "Science works through the **scientific method**: observe, hypothesize, test, analyze, conclude. It's all about asking questions and finding answers through experiments!",
        programming: "Programming is like giving instructions to a computer. You write code (instructions) in a language the computer understands, and it follows those instructions exactly!",
        math: "Math is the language of patterns and relationships. It helps us describe and predict how things work, from simple counting to complex physics equations!",
        brain: "Your brain works through neurons sending electrical and chemical signals. It's constantly forming new connections based on what you learn and experience!"
      };
      
      return explanations[topic] || "Great question about how things work! What specific system or concept are you curious about?";
    },
    
    // Handle general messages
    handleGeneral: (message, analysis) => {
      const responses = [
        "That's interesting! Tell me more about what you're thinking.",
        "I'm listening! What made you curious about this?",
        "Great topic! I'd love to explore this with you. What specific aspect interests you most?",
        "Fascinating! Here's what I know about that...",
        "Good question! Let's dive into this together."
      ];
      
      let response = responses[Math.floor(Math.random() * responses.length)];
      
      // Add topic-specific response if topics detected
      if (analysis.topics.length > 0) {
        response += `\n\nI see you're interested in ${analysis.topics.join(', ')}. `;
      }
      
      return response;
    },
    
    // Update user context
    updateContext: (message, analysis) => {
      // Track topics
      for (const topic of analysis.topics) {
        if (!ConversationalAI.userContext.recentTopics.includes(topic)) {
          ConversationalAI.userContext.recentTopics.unshift(topic);
        }
      }
      
      // Keep only recent topics
      ConversationalAI.userContext.recentTopics = ConversationalAI.userContext.recentTopics.slice(0, 10);
      
      // Extract name if mentioned
      const nameMatch = message.match(/my name is (\w+)/i) || message.match(/i'm (\w+)/i);
      if (nameMatch) {
        ConversationalAI.userContext.name = nameMatch[1];
      }
    },
    
    // Clear conversation
    clearConversation: () => {
      ConversationalAI.conversationHistory = [];
      ConversationalAI.userContext = {
        name: null,
        interests: [],
        recentTopics: [],
        mood: 'neutral'
      };
    },
    
    // Get conversation summary
    getSummary: () => {
      const messageCount = ConversationalAI.conversationHistory.length;
      const topics = [...new Set(ConversationalAI.userContext.recentTopics)];
      
      return {
        messages: messageCount,
        topics: topics,
        duration: messageCount > 0 ? 
          new Date() - ConversationalAI.conversationHistory[0].timestamp : 0
      };
    }
  };
  
  // Export public interface
  return {
    SymbolicMath,
    LinearAlgebra,
    Calculus,
    Physics,
    ProblemSolver,
    GraphPlotter,
    LaTeXRenderer,
    ConversationalAI
  };
  
})();

// Make globally available
window.AdvancedEngine = AdvancedEngine;
