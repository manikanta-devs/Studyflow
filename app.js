/* ===================================================================
   STUDYFLOW PRO - APPLICATION LOGIC
   UI management, event handling, data persistence
   =================================================================== */

(function() {
  'use strict';
  
  /* ===================================================================
     STATE MANAGEMENT
     =================================================================== */
  
  const AppState = {
    currentFeature: 'solver',
    theme: 'dark',
    history: [],
    
    init() {
      // Load from localStorage
      const saved = localStorage.getItem('studyflow-pro-state');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.theme = data.theme || 'dark';
          this.history = data.history || [];
        } catch (e) {
          console.error('Error loading state:', e);
        }
      }
      
      // Apply theme
      this.applyTheme();
    },
    
    save() {
      try {
        localStorage.setItem('studyflow-pro-state', JSON.stringify({
          theme: this.theme,
          history: this.history.slice(-50) // Keep last 50 items
        }));
      } catch (e) {
        console.error('Error saving state:', e);
      }
    },
    
    applyTheme() {
      document.body.setAttribute('data-theme', this.theme);
    },
    
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      this.applyTheme();
      this.save();
    },
    
    addToHistory(item) {
      this.history.unshift({
        ...item,
        timestamp: new Date().toISOString()
      });
      this.save();
    }
  };
  
  /* ===================================================================
     UI MANAGEMENT
     =================================================================== */
  
  const UI = {
    
    init() {
      this.setupEventListeners();
      this.setupFeatureNavigation();
    },
    
    setupEventListeners() {
      // Theme toggle
      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          AppState.toggleTheme();
        });
      }
      
      // History button
      const historyBtn = document.getElementById('historyBtn');
      if (historyBtn) {
        historyBtn.addEventListener('click', () => {
          this.showHistory();
        });
      }
      
      // Close history modal
      const closeHistoryBtn = document.getElementById('closeHistoryBtn');
      if (closeHistoryBtn) {
        closeHistoryBtn.addEventListener('click', () => {
          this.hideHistory();
        });
      }
      
      // Close modal on outside click
      const historyModal = document.getElementById('historyModal');
      if (historyModal) {
        historyModal.addEventListener('click', (e) => {
          if (e.target === historyModal) {
            this.hideHistory();
          }
        });
      }
      
      // Advanced Solver
      this.setupSolverFeature();
      
      // Symbolic Calculator
      this.setupCalculatorFeature();
      
      // Graph Plotter
      this.setupGrapherFeature();
      
      // Matrix Operations
      this.setupMatrixFeature();
      
      // Calculus
      this.setupCalculusFeature();
      
      // Physics
      this.setupPhysicsFeature();
      
      // Notes
      this.setupNotesFeature();
      
      // Research
      this.setupResearchFeature();
      
      // Chat Assistant
      this.setupChatFeature();
    },
    
    setupFeatureNavigation() {
      const featureBtns = document.querySelectorAll('.feature-btn');
      const featureSections = document.querySelectorAll('.feature-section');
      
      featureBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const feature = btn.getAttribute('data-feature');
          
          // Update active states
          featureBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          featureSections.forEach(section => {
            section.classList.remove('active');
          });
          
          const targetSection = document.getElementById(`${feature}-section`);
          if (targetSection) {
            targetSection.classList.add('active');
          }
          
          AppState.currentFeature = feature;
        });
      });
    },
    
    /* === ADVANCED SOLVER === */
    setupSolverFeature() {
      const solveBtn = document.getElementById('solveBtn');
      const clearBtn = document.getElementById('clearSolverBtn');
      const solverInput = document.getElementById('solverInput');
      const solverSubject = document.getElementById('solverSubject');
      const solverResult = document.getElementById('solverResult');
      const solverContent = document.getElementById('solverContent');
      
      if (solveBtn && solverInput && solverContent) {
        solveBtn.addEventListener('click', () => {
          const problem = solverInput.value.trim();
          const subject = solverSubject.value;
          
          if (!problem) {
            alert('Please enter a problem to solve');
            return;
          }
          
          // Show loading
          solverContent.innerHTML = '<div class="loading"></div> Analyzing problem...';
          solverResult.style.display = 'block';
          
          // Solve problem
          setTimeout(() => {
            const solution = AdvancedEngine.ProblemSolver.solve(problem, subject);
            solverContent.innerHTML = solution;
            
            // Render LaTeX if present
            AdvancedEngine.LaTeXRenderer.renderAll(solverContent);
            
            // Add to history
            AppState.addToHistory({
              type: 'solver',
              problem: problem,
              subject: subject,
              solution: solution
            });
          }, 500);
        });
        
        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            solverInput.value = '';
            solverResult.style.display = 'none';
          });
        }
      }
      
      // Copy button
      const copyBtn = document.getElementById('copySolverBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const content = solverContent.innerText;
          this.copyToClipboard(content);
        });
      }
      
      // Save button
      const saveBtn = document.getElementById('saveSolverBtn');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          alert('Solution saved to history!');
        });
      }
      
      // Export PDF button
      const exportBtn = document.getElementById('exportPdfBtn');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          window.print();
        });
      }
    },
    
    /* === SYMBOLIC CALCULATOR === */
    setupCalculatorFeature() {
      const calcInput = document.getElementById('calcInput');
      const calcResult = document.getElementById('calcResult');
      const calcContent = document.getElementById('calcContent');
      const opBtns = document.querySelectorAll('.op-btn');
      
      if (calcInput && calcContent && opBtns.length > 0) {
        opBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const operation = btn.getAttribute('data-op');
            const expression = calcInput.value.trim();
            
            if (!expression) {
              alert('Please enter an expression');
              return;
            }
            
            calcResult.style.display = 'block';
            calcContent.innerHTML = '<div class="loading"></div> Computing...';
            
            setTimeout(() => {
              let result;
              
              switch(operation) {
                case 'simplify':
                  result = AdvancedEngine.SymbolicMath.simplify(expression);
                  break;
                case 'expand':
                  result = AdvancedEngine.SymbolicMath.expand(expression);
                  break;
                case 'factor':
                  calcContent.innerHTML = '<p>Factoring: Use symbolic computation or manual methods</p>';
                  return;
                case 'derivative':
                  result = AdvancedEngine.SymbolicMath.derivative(expression);
                  break;
                case 'integral':
                  calcContent.innerHTML = '<p>For integrals, use the Calculus section for numerical integration</p>';
                  return;
                case 'solve':
                  result = AdvancedEngine.SymbolicMath.solve(expression);
                  break;
              }
              
              if (result && result.error) {
                calcContent.innerHTML = `<p class="text-error">Error: ${result.error}</p>`;
              } else if (result) {
                let html = '<div class="solution-container">';
                html += `<h4>${operation.charAt(0).toUpperCase() + operation.slice(1)} Result:</h4>`;
                
                if (result.original) {
                  html += `<p><strong>Original:</strong> ${result.original}</p>`;
                }
                if (result.simplified) {
                  html += `<p><strong>Simplified:</strong> ${result.simplified}</p>`;
                }
                if (result.expanded) {
                  html += `<p><strong>Expanded:</strong> ${result.expanded}</p>`;
                }
                if (result.derivative) {
                  html += `<p><strong>Derivative:</strong> ${result.derivative}</p>`;
                }
                if (result.solutions) {
                  html += `<p><strong>Solutions:</strong> ${JSON.stringify(result.solutions)}</p>`;
                }
                if (result.latex) {
                  html += `<div class="latex-display">$$${result.latex}$$</div>`;
                }
                
                html += '</div>';
                calcContent.innerHTML = html;
                
                // Render LaTeX
                AdvancedEngine.LaTeXRenderer.renderAll(calcContent);
              }
            }, 300);
          });
        });
      }
    },
    
    /* === GRAPH PLOTTER === */
    setupGrapherFeature() {
      const plotBtn = document.getElementById('plotBtn');
      const graphInput = document.getElementById('graphInput');
      const xMin = document.getElementById('xMin');
      const xMax = document.getElementById('xMax');
      
      if (plotBtn && graphInput) {
        plotBtn.addEventListener('click', () => {
          const functions = graphInput.value.trim();
          const xMinVal = parseFloat(xMin.value);
          const xMaxVal = parseFloat(xMax.value);
          
          if (!functions) {
            alert('Please enter at least one function');
            return;
          }
          
          if (xMinVal >= xMaxVal) {
            alert('X min must be less than X max');
            return;
          }
          
          const result = AdvancedEngine.GraphPlotter.plot(
            functions,
            xMinVal,
            xMaxVal,
            'graphPlot'
          );
          
          if (result.error) {
            alert(`Error plotting: ${result.error}`);
          }
        });
      }
    },
    
    /* === MATRIX OPERATIONS === */
    setupMatrixFeature() {
      const matrixInput = document.getElementById('matrixInput');
      const matrixResult = document.getElementById('matrixResult');
      const matrixContent = document.getElementById('matrixContent');
      const matrixBtns = document.querySelectorAll('.matrix-btn');
      
      if (matrixInput && matrixContent && matrixBtns.length > 0) {
        matrixBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const operation = btn.getAttribute('data-op');
            const matrixStr = matrixInput.value.trim();
            
            if (!matrixStr) {
              alert('Please enter a matrix');
              return;
            }
            
            matrixResult.style.display = 'block';
            matrixContent.innerHTML = '<div class="loading"></div> Computing...';
            
            setTimeout(() => {
              let result;
              
              switch(operation) {
                case 'det':
                  result = AdvancedEngine.LinearAlgebra.determinant(matrixStr);
                  break;
                case 'inv':
                  result = AdvancedEngine.LinearAlgebra.inverse(matrixStr);
                  break;
                case 'eig':
                  result = AdvancedEngine.LinearAlgebra.eigenvalues(matrixStr);
                  break;
                case 'transpose':
                  result = AdvancedEngine.LinearAlgebra.transpose(matrixStr);
                  break;
                case 'rank':
                  result = AdvancedEngine.LinearAlgebra.rank(matrixStr);
                  break;
                case 'lu':
                  result = AdvancedEngine.LinearAlgebra.luDecomposition(matrixStr);
                  break;
              }
              
              if (result && result.error) {
                matrixContent.innerHTML = `<p class="text-error">Error: ${result.error}</p>`;
              } else if (result) {
                let html = '<div class="solution-container">';
                html += `<h4>${operation.toUpperCase()} Result:</h4>`;
                
                if (result.determinant !== undefined) {
                  html += `<p><strong>Determinant:</strong> ${result.determinant}</p>`;
                }
                if (result.inverse) {
                  html += `<p><strong>Inverse Matrix:</strong></p><pre>${JSON.stringify(result.inverse, null, 2)}</pre>`;
                }
                if (result.eigenvalues) {
                  html += `<p><strong>Eigenvalues:</strong> ${JSON.stringify(result.eigenvalues)}</p>`;
                }
                if (result.transpose) {
                  html += `<p><strong>Transpose:</strong></p><pre>${JSON.stringify(result.transpose, null, 2)}</pre>`;
                }
                if (result.rank !== undefined) {
                  html += `<p><strong>Rank:</strong> ${result.rank}</p>`;
                }
                if (result.L && result.U) {
                  html += `<p><strong>LU Decomposition:</strong></p>`;
                  html += `<p>L:</p><pre>${JSON.stringify(result.L, null, 2)}</pre>`;
                  html += `<p>U:</p><pre>${JSON.stringify(result.U, null, 2)}</pre>`;
                }
                if (result.latex) {
                  html += `<div class="latex-display">$$${result.latex}$$</div>`;
                }
                
                html += '</div>';
                matrixContent.innerHTML = html;
                
                // Render LaTeX
                AdvancedEngine.LaTeXRenderer.renderAll(matrixContent);
              }
            }, 300);
          });
        });
      }
    },
    
    /* === CALCULUS === */
    setupCalculusFeature() {
      const calculusInput = document.getElementById('calculusInput');
      const calculusVar = document.getElementById('calculusVar');
      const calculusResult = document.getElementById('calculusResult');
      const calculusContent = document.getElementById('calculusContent');
      const calcBtns = document.querySelectorAll('.calc-btn');
      
      if (calculusInput && calculusContent && calcBtns.length > 0) {
        calcBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const operation = btn.getAttribute('data-op');
            const funcStr = calculusInput.value.trim();
            const variable = calculusVar.value.trim() || 'x';
            
            if (!funcStr) {
              alert('Please enter a function');
              return;
            }
            
            calculusResult.style.display = 'block';
            calculusContent.innerHTML = '<div class="loading"></div> Computing...';
            
            setTimeout(() => {
              let result;
              
              switch(operation) {
                case 'derivative':
                  result = AdvancedEngine.Calculus.derivative(funcStr, variable);
                  break;
                case 'integral':
                  // Numerical integration from -10 to 10
                  result = AdvancedEngine.Calculus.integrate(funcStr, variable, -10, 10);
                  break;
                case 'limit':
                  result = AdvancedEngine.Calculus.limit(funcStr, variable, 0);
                  break;
                case 'taylor':
                  result = AdvancedEngine.Calculus.taylorSeries(funcStr, variable, 0, 5);
                  break;
              }
              
              if (result && result.error) {
                calculusContent.innerHTML = `<p class="text-error">Error: ${result.error}</p>`;
              } else if (result) {
                let html = '<div class="solution-container">';
                html += `<h4>${operation.charAt(0).toUpperCase() + operation.slice(1)} Result:</h4>`;
                
                if (result.derivative) {
                  html += `<p><strong>Derivative:</strong> ${result.derivative}</p>`;
                }
                if (result.result !== undefined) {
                  html += `<p><strong>Result:</strong> ${result.result}</p>`;
                }
                if (result.limit !== undefined) {
                  html += `<p><strong>Limit:</strong> ${result.limit}</p>`;
                }
                if (result.terms) {
                  html += '<p><strong>Taylor Series Terms:</strong></p><ul>';
                  result.terms.forEach(term => {
                    html += `<li>Order ${term.order}: ${term.term}</li>`;
                  });
                  html += '</ul>';
                }
                if (result.latex) {
                  html += `<div class="latex-display">$$${result.latex}$$</div>`;
                }
                
                html += '</div>';
                calculusContent.innerHTML = html;
                
                // Render LaTeX
                AdvancedEngine.LaTeXRenderer.renderAll(calculusContent);
              }
            }, 300);
          });
        });
      }
    },
    
    /* === PHYSICS === */
    setupPhysicsFeature() {
      const physicsBtn = document.getElementById('physicsBtn');
      const physicsInput = document.getElementById('physicsInput');
      const physicsResult = document.getElementById('physicsResult');
      const physicsContent = document.getElementById('physicsContent');
      
      if (physicsBtn && physicsInput && physicsContent) {
        physicsBtn.addEventListener('click', () => {
          const problem = physicsInput.value.trim();
          
          if (!problem) {
            alert('Please describe the physics problem');
            return;
          }
          
          physicsResult.style.display = 'block';
          physicsContent.innerHTML = '<div class="loading"></div> Solving...';
          
          setTimeout(() => {
            let html = '<div class="solution-container">';
            html += '<h4>Physics Solution:</h4>';
            
            // Detect projectile motion
            if (problem.toLowerCase().includes('projectile')) {
              const v0Match = problem.match(/v[₀0]?\s*=\s*(\d+\.?\d*)/i);
              const angleMatch = problem.match(/[θangle]\s*=\s*(\d+\.?\d*)/i);
              
              if (v0Match && angleMatch) {
                const v0 = parseFloat(v0Match[1]);
                const angle = parseFloat(angleMatch[1]);
                const result = AdvancedEngine.Physics.projectile(v0, angle);
                
                html += '<h5>Projectile Motion Analysis</h5>';
                html += `<p><strong>Initial Velocity:</strong> ${result.initialVelocity} m/s</p>`;
                html += `<p><strong>Launch Angle:</strong> ${result.angle}°</p>`;
                html += `<p><strong>Velocity Components:</strong> vₓ = ${result.components.vx} m/s, vᵧ = ${result.components.vy} m/s</p>`;
                html += `<p><strong>Time of Flight:</strong> ${result.timeOfFlight} s</p>`;
                html += `<p><strong>Maximum Height:</strong> ${result.maxHeight} m</p>`;
                html += `<p><strong>Range:</strong> ${result.range} m</p>`;
                
                // Plot trajectory
                const xData = result.trajectory.map(p => p.x);
                const yData = result.trajectory.map(p => p.y);
                
                physicsContent.innerHTML = html + '</div>';
                
                setTimeout(() => {
                  Plotly.newPlot('physicsPlot', [{
                    x: xData,
                    y: yData,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Trajectory',
                    line: { width: 3 }
                  }], {
                    title: 'Projectile Trajectory',
                    xaxis: { title: 'Distance (m)' },
                    yaxis: { title: 'Height (m)' },
                    paper_bgcolor: '#1e293b',
                    plot_bgcolor: '#0f172a',
                    font: { color: '#f1f5f9' }
                  }, { responsive: true });
                }, 100);
                
                return;
              }
            }
            
            // Generic physics solution
            html += '<p>Advanced physics problem. Key steps:</p>';
            html += '<ol>';
            html += '<li>Identify all forces and variables</li>';
            html += '<li>Apply relevant physics principles</li>';
            html += '<li>Set up equations</li>';
            html += '<li>Solve systematically</li>';
            html += '</ol>';
            html += '</div>';
            
            physicsContent.innerHTML = html;
          }, 500);
        });
      }
    },
    
    /* === NOTES === */
    setupNotesFeature() {
      const notesBtn = document.getElementById('notesBtn');
      const notesTopic = document.getElementById('notesTopic');
      const notesStyle = document.getElementById('notesStyle');
      const notesResult = document.getElementById('notesResult');
      const notesContent = document.getElementById('notesContent');
      
      if (notesBtn && notesTopic && notesContent) {
        notesBtn.addEventListener('click', () => {
          const topic = notesTopic.value.trim();
          const style = notesStyle.value;
          
          if (!topic) {
            alert('Please enter a topic');
            return;
          }
          
          notesResult.style.display = 'block';
          notesContent.innerHTML = '<div class="loading"></div> Generating notes...';
          
          setTimeout(() => {
            const notes = this.generateNotes(topic, style);
            notesContent.innerHTML = notes;
            
            // Render LaTeX if present
            AdvancedEngine.LaTeXRenderer.renderAll(notesContent);
          }, 500);
        });
      }
    },
    
    /* === RESEARCH === */
    setupResearchFeature() {
      const researchBtn = document.getElementById('researchBtn');
      const researchInput = document.getElementById('researchInput');
      const researchResult = document.getElementById('researchResult');
      const researchContent = document.getElementById('researchContent');
      
      if (researchBtn && researchInput && researchContent) {
        researchBtn.addEventListener('click', () => {
          const query = researchInput.value.trim();
          
          if (!query) {
            alert('Please enter a research query');
            return;
          }
          
          researchResult.style.display = 'block';
          researchContent.innerHTML = '<div class="loading"></div> Researching...';
          
          setTimeout(() => {
            const research = this.generateResearch(query);
            researchContent.innerHTML = research;
          }, 500);
        });
      }
    },
    
    /* === CHAT ASSISTANT === */
    setupChatFeature() {
      const chatInput = document.getElementById('chatInput');
      const sendBtn = document.getElementById('sendChatBtn');
      const chatMessages = document.getElementById('chatMessages');
      const clearChatBtn = document.getElementById('clearChatBtn');
      const exportChatBtn = document.getElementById('exportChatBtn');
      const quickBtns = document.querySelectorAll('.quick-btn');
      
      if (!chatInput || !sendBtn || !chatMessages) return;
      
      // Send message function
      const sendMessage = () => {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message to UI
        this.addChatMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate response (simulate AI thinking time)
        setTimeout(() => {
          this.removeTypingIndicator();
          const response = ConversationEngine.generateResponse(message);
          this.addChatMessage(response, 'assistant');
        }, 500 + Math.random() * 1000); // Random delay for realism
      };
      
      // Send button click
      sendBtn.addEventListener('click', sendMessage);
      
      // Enter to send
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
      
      // Auto-resize textarea
      chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
      });
      
      // Quick action buttons
      quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const message = btn.getAttribute('data-msg');
          chatInput.value = message;
          sendMessage();
        });
      });
      
      // Clear chat
      if (clearChatBtn) {
        clearChatBtn.addEventListener('click', () => {
          if (confirm('Clear all chat messages?')) {
            // Remove all messages except the welcome message
            const messages = chatMessages.querySelectorAll('.message');
            messages.forEach((msg, index) => {
              if (index > 0) msg.remove(); // Keep first welcome message
            });
            
            // Clear AI memory
            ConversationEngine.clearHistory();
          }
        });
      }
      
      // Export chat
      if (exportChatBtn) {
        exportChatBtn.addEventListener('click', () => {
          this.exportChat();
        });
      }
    },
    
    addChatMessage(text, role) {
      const chatMessages = document.getElementById('chatMessages');
      if (!chatMessages) return;
      
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${role}-message`;
      
      // Create avatar
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      
      if (role === 'assistant') {
        avatar.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
            <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
          </svg>
        `;
      } else {
        avatar.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" stroke-width="2"/>
          </svg>
        `;
      }
      
      // Create message content
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      
      const messageText = document.createElement('div');
      messageText.className = 'message-text';
      
      // Format text with markdown-like features
      const formattedText = this.formatChatMessage(text);
      messageText.innerHTML = formattedText;
      
      const messageTime = document.createElement('div');
      messageTime.className = 'message-time';
      messageTime.textContent = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      messageContent.appendChild(messageText);
      messageContent.appendChild(messageTime);
      
      messageDiv.appendChild(avatar);
      messageDiv.appendChild(messageContent);
      
      chatMessages.appendChild(messageDiv);
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    },
    
    formatChatMessage(text) {
      // Convert markdown-like syntax to HTML
      let formatted = text;
      
      // Bold
      formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      
      // Italic
      formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
      
      // Code
      formatted = formatted.replace(/`(.+?)`/g, '<code>$1</code>');
      
      // Bullet lists
      formatted = formatted.replace(/^• (.+)$/gm, '<li>$1</li>');
      if (formatted.includes('<li>')) {
        formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
      }
      
      // Numbered lists
      formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
      
      // Line breaks
      formatted = formatted.replace(/\n\n/g, '</p><p>');
      formatted = formatted.replace(/\n/g, '<br>');
      
      // Wrap in paragraph if not already formatted
      if (!formatted.startsWith('<')) {
        formatted = '<p>' + formatted + '</p>';
      }
      
      return formatted;
    },
    
    showTypingIndicator() {
      const chatMessages = document.getElementById('chatMessages');
      if (!chatMessages) return;
      
      const typingDiv = document.createElement('div');
      typingDiv.className = 'message assistant-message typing-message';
      typingDiv.id = 'typingIndicator';
      
      typingDiv.innerHTML = `
        <div class="message-avatar">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
            <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="message-content">
          <div class="message-text">
            <div class="typing-indicator">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          </div>
        </div>
      `;
      
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    },
    
    removeTypingIndicator() {
      const indicator = document.getElementById('typingIndicator');
      if (indicator) {
        indicator.remove();
      }
    },
    
    exportChat() {
      const chatMessages = document.getElementById('chatMessages');
      if (!chatMessages) return;
      
      const messages = chatMessages.querySelectorAll('.message');
      let exportText = '# StudyFlow Pro Chat Export\n';
      exportText += `Date: ${new Date().toLocaleString()}\n\n`;
      exportText += '---\n\n';
      
      messages.forEach(msg => {
        const role = msg.classList.contains('user-message') ? 'You' : 'AI Assistant';
        const text = msg.querySelector('.message-text').innerText;
        const time = msg.querySelector('.message-time')?.textContent || '';
        
        exportText += `**${role}** (${time})\n${text}\n\n`;
      });
      
      // Create download link
      const blob = new Blob([exportText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `studyflow-chat-${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
      
      // Show success message
      this.showNotification('Chat exported successfully!');
    },
    
    showNotification(message) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--accent-success);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    },
    
    /* === HELPER FUNCTIONS === */
    generateNotes(topic, style) {
      let html = '<div class="notes-container">';
      html += `<h3>${topic}</h3>`;
      
      switch(style) {
        case 'cornell':
          html += '<div class="cornell-notes">';
          html += '<div><strong>Cues:</strong><ul><li>Key concepts</li><li>Questions</li><li>Keywords</li></ul></div>';
          html += '<div><strong>Notes:</strong><p>Main content and detailed explanations go here...</p></div>';
          html += '<div><strong>Summary:</strong><p>Brief recap of main points...</p></div>';
          html += '</div>';
          break;
          
        case 'outline':
          html += '<ol>';
          html += '<li><strong>Introduction</strong><ul><li>Background</li><li>Context</li></ul></li>';
          html += '<li><strong>Main Concepts</strong><ul><li>Concept 1</li><li>Concept 2</li></ul></li>';
          html += '<li><strong>Applications</strong></li>';
          html += '<li><strong>Conclusion</strong></li>';
          html += '</ol>';
          break;
          
        case 'mindmap':
          html += '<p>Mind Map structure:</p>';
          html += '<pre>';
          html += `${topic}\n`;
          html += '  ├─ Concept A\n';
          html += '  │   ├─ Detail 1\n';
          html += '  │   └─ Detail 2\n';
          html += '  ├─ Concept B\n';
          html += '  └─ Concept C\n';
          html += '</pre>';
          break;
          
        case 'flashcards':
          html += '<div class="flashcards">';
          html += '<div class="card"><strong>Q:</strong> What is...?<br><strong>A:</strong> ...</div>';
          html += '<div class="card"><strong>Q:</strong> How does...?<br><strong>A:</strong> ...</div>';
          html += '<div class="card"><strong>Q:</strong> Why is...?<br><strong>A:</strong> ...</div>';
          html += '</div>';
          break;
          
        case 'summary':
          html += '<p><strong>Key Points:</strong></p>';
          html += '<ul>';
          html += '<li>Main idea 1</li>';
          html += '<li>Main idea 2</li>';
          html += '<li>Main idea 3</li>';
          html += '</ul>';
          html += '<p><strong>Important Formulas/Concepts:</strong></p>';
          html += '<p>...</p>';
          break;
      }
      
      html += '</div>';
      return html;
    },
    
    generateResearch(query) {
      let html = '<div class="research-container">';
      html += '<h3>Research Analysis</h3>';
      html += `<p><strong>Query:</strong> ${query}</p>`;
      html += '<h4>Overview</h4>';
      html += '<p>This is a comprehensive research topic that requires examining multiple perspectives...</p>';
      html += '<h4>Key Concepts</h4>';
      html += '<ul>';
      html += '<li>Fundamental principles</li>';
      html += '<li>Current state of research</li>';
      html += '<li>Recent developments</li>';
      html += '</ul>';
      html += '<h4>Applications</h4>';
      html += '<p>Real-world applications and implications...</p>';
      html += '<h4>Further Reading</h4>';
      html += '<p>Recommended resources for deeper understanding...</p>';
      html += '</div>';
      return html;
    },
    
    showHistory() {
      const modal = document.getElementById('historyModal');
      const historyList = document.getElementById('historyList');
      
      if (!modal || !historyList) return;
      
      if (AppState.history.length === 0) {
        historyList.innerHTML = '<p>No history yet. Start solving problems!</p>';
      } else {
        let html = '<div class="history-items">';
        AppState.history.forEach((item, index) => {
          const date = new Date(item.timestamp);
          html += '<div class="history-item">';
          html += `<h4>${item.type} - ${date.toLocaleDateString()}</h4>`;
          html += `<p>${item.problem || item.expression || 'Calculation'}</p>`;
          html += '</div>';
        });
        html += '</div>';
        historyList.innerHTML = html;
      }
      
      modal.classList.add('active');
    },
    
    hideHistory() {
      const modal = document.getElementById('historyModal');
      if (modal) {
        modal.classList.remove('active');
      }
    },
    
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        // Show temporary success message
        const msg = document.createElement('div');
        msg.textContent = 'Copied to clipboard!';
        msg.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#10b981;color:white;padding:1rem 2rem;border-radius:8px;z-index:10000;animation:slideIn 0.3s';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    }
  };
  
  /* ===================================================================
     INITIALIZATION
     =================================================================== */
  
  document.addEventListener('DOMContentLoaded', () => {
    AppState.init();
    UI.init();
  });
  
})();
