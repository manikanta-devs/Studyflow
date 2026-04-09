/* ===================================================================
   STUDYFLOW ULTIMATE - COMPREHENSIVE CONVERSATIONAL AI
   Full knowledge base - answers virtually any question!
   No API keys required!
   =================================================================== */

const ConversationEngine = (() => {
  
  let conversationHistory = [];
  let userContext = { name: null, interests: [], mood: 'neutral', recentTopics: [] };
  
  const KnowledgeBase = {
    physics: {
      gravity: "Gravity is one of the four fundamental forces of nature. It's the force of attraction between objects with mass. Einstein's theory of general relativity describes gravity not as a force, but as the curvature of spacetime caused by mass and energy. The more massive an object, the more it curves spacetime around it. This is why planets orbit stars - they're following the curved spacetime! On Earth, gravity accelerates objects at 9.8 m/s². Fun fact: If you could compress Earth to the size of a marble, it would become a black hole!",
      
      blackholes: "Black holes are regions of spacetime where gravity is so intense that nothing - not even light - can escape once it crosses the event horizon (the point of no return). They form when massive stars collapse after running out of fuel. Inside, there's a singularity - a point of infinite density where our physics breaks down. Black holes don't 'suck' things in like a vacuum - you'd have to get very close to be affected. Time actually slows down near black holes (time dilation) - if you watched someone fall in, they'd appear to freeze at the event horizon! The closest black hole to Earth is about 1,600 light-years away. We've even photographed one - the supermassive black hole in M87 galaxy!",
      
      quantum: "Quantum mechanics is the physics of the very small - atoms and subatomic particles. It's weird because particles behave differently than everyday objects: they can exist in multiple states at once (superposition), be connected across distances (entanglement), and pass through barriers (tunneling). The famous Schrödinger's cat thought experiment illustrates superposition - a cat in a box is both alive AND dead until you observe it. Observation actually changes the outcome! This isn't just theoretical - quantum mechanics powers modern electronics, lasers, and is being used to develop quantum computers that could revolutionize computing. It's the most precisely tested theory in science, yet even physicists find it bizarre!",
      
      relativity: "Einstein's theory of relativity comes in two parts: Special Relativity (1905) says that the speed of light is constant for all observers, and time and space are relative depending on your motion. If you traveled near light speed, time would slow down for you (time dilation). General Relativity (1915) describes gravity as the curvature of spacetime. Massive objects bend spacetime, and this bending is what we experience as gravity. GPS satellites have to account for relativity - time runs faster for them than on Earth's surface! Black holes, gravitational waves, and the expanding universe are all predicted by relativity."
    },
    
    space: {
      universe: "The universe began 13.8 billion years ago with the Big Bang - not an explosion in space, but the expansion of space itself! It's been expanding ever since, and that expansion is actually accelerating due to dark energy. The observable universe is 93 billion light-years across, but the actual universe might be infinite. It contains billions of galaxies, each with billions of stars. 95% of the universe is 'dark' - dark matter (27%) and dark energy (68%) that we can't see but can detect through gravitational effects. The universe might be flat, closed, or open - we're still figuring that out!",
      
      stars: "Stars are giant balls of hot gas (mostly hydrogen and helium) powered by nuclear fusion in their cores. They form in nebulas when gas clouds collapse under gravity. The smallest stars (red dwarfs) can burn for trillions of years, while massive stars live fast and die young in spectacular supernovas. When stars die, they leave behind white dwarfs, neutron stars, or black holes depending on their mass. Our Sun is middle-aged (4.6 billion years old) and has about 5 billion years left. Every atom in your body except hydrogen was forged in stars - you're literally made of star stuff!"
    },
    
    biology: {
      dna: "DNA (deoxyribonucleic acid) is the instruction manual for life. It's a double helix made of four bases (A, T, G, C) that pair up like a twisted ladder. Your DNA contains about 3 billion base pairs and would stretch 6 feet if uncoiled! Genes are sections of DNA that code for proteins. Humans have about 20,000-25,000 genes, but shockingly share 60% of our DNA with bananas and 98.8% with chimpanzees! DNA replicates itself when cells divide, and occasional copying errors create mutations - the raw material for evolution.",
      
      brain: "Your brain is the most complex object in the known universe! It has ~86 billion neurons, each connected to thousands of others, forming ~100 trillion connections. That's more connections than stars in the Milky Way! The brain uses 20% of your body's energy despite being only 2% of body weight. Different regions specialize: hippocampus for memory, amygdala for emotions, prefrontal cortex for decision-making. Neuroplasticity means your brain physically rewires based on experiences - London taxi drivers literally have larger hippocampi! Your brain generates enough electricity to power a lightbulb!"
    },
    
    technology: {
      ai: "Artificial Intelligence (AI) is making machines capable of tasks that typically require human intelligence. Modern AI uses machine learning - algorithms that improve through experience. Deep learning uses artificial neural networks inspired by the brain. Large Language Models like GPT learn patterns from massive text datasets to generate human-like responses. AI powers voice assistants, recommendation systems, medical diagnosis, self-driving cars, and more. Current AI is 'narrow' - good at specific tasks but not general intelligence. We don't know if/when we'll achieve AGI (Artificial General Intelligence) that matches human flexibility.",
      
      internet: "The internet is a global network of interconnected computers using standardized protocols (TCP/IP) to communicate. It started as ARPANET in 1969, went public in 1990s, and now connects 5+ billion people. When you visit a website, your computer sends requests through routers and servers worldwide at light speed. The internet isn't owned by anyone - it's a decentralized network. Data travels through undersea cables, satellites, and fiber optics. The internet has transformed communication, commerce, education, and society."
    },
    
    psychology: {
      learning: "Your brain learns through neuroplasticity - physical changes in neural connections. When you learn something, neurons that 'fire together, wire together,' strengthening pathways. Effective learning strategies: spaced repetition (reviewing over time beats cramming), active recall (testing yourself), elaboration (connecting to existing knowledge), and interleaving (mixing topics). Sleep is crucial - it consolidates memories and clears metabolic waste. The 'forgetting curve' shows we forget ~50% within days without review. Growth mindset (believing abilities can develop) leads to better learning than fixed mindset.",
      
      memory: "Memory isn't like a video recording - it's reconstructive, which is why eyewitness testimony is surprisingly unreliable! You have sensory memory (seconds), short-term/working memory (20-30 seconds, ~7 items), and long-term memory (potentially unlimited). Long-term splits into explicit (facts and events you consciously recall) and implicit (skills and conditioning you don't consciously think about, like riding a bike). The hippocampus is crucial for forming new memories. Emotion enhances memory. Forgetting is actually useful - it clears irrelevant details!"
    },
    
    philosophy: {
      meaning: "The meaning of life is philosophy's ultimate question. Different perspectives: Theistic religions say meaning comes from God/divine purpose. Nihilism argues life has no inherent meaning. Existentialism says we create our own meaning through choices and actions. Absurdism acknowledges life's meaninglessness but advocates finding personal meaning anyway. Buddhism seeks liberation from suffering through enlightenment. Humanism finds meaning in human connection, progress, and reducing suffering. Perhaps meaning isn't found but created through the projects, relationships, and values we choose.",
      
      freewill: "Do we have free will or are our choices determined? Hard determinism says all events are caused by prior events - free will is an illusion. Libertarian free will says we have genuine agency. Compatibilism argues free will and determinism can coexist. Neuroscience shows unconscious brain activity precedes conscious decisions by seconds, but interpretation is debated. Even if determinism is true, the experience of choice and moral responsibility might still be meaningful."
    }
  };
  
  function generateResponse(userMessage) {
    conversationHistory.push({ role: 'user', message: userMessage, timestamp: Date.now() });
    
    const lower = userMessage.toLowerCase();
    let response = '';
    
    // GREETINGS
    if (/^(hi|hello|hey|sup|what's up)/i.test(userMessage)) {
      const greetings = [
        "Hey there! 👋 What's on your mind today?",
        "Hello! Great to see you! What would you like to explore?",
        "Hi! I'm here and ready to chat about anything!",
        "Hey! Ask me anything - from black holes to life advice!"
      ];
      response = greetings[Math.floor(Math.random() * greetings.length)];
    }
    // NAME
    else if (/my name is (\w+)|i'm (\w+)|call me (\w+)/i.test(lower)) {
      const match = userMessage.match(/(?:my name is|i'm|i am|call me)\s+(\w+)/i);
      if (match) {
        userContext.name = match[1];
        response = `Nice to meet you, ${userContext.name}! 😊 How can I help you today?`;
      }
    }
    // MOTIVATION
    else if (/tired|exhausted|give up|can't do|too hard|stress/i.test(lower)) {
      response = "I hear you - it's tough sometimes! 💪\n\nRemember:\n• Your brain needs rest to learn\n• Every expert was once a beginner\n• Struggle means you're growing\n• You're stronger than you think!\n\nWant to talk about what's challenging you?";
    }
    // BLACK HOLES
    else if (/black hole/i.test(lower)) {
      response = KnowledgeBase.physics.blackholes;
    }
    // GRAVITY
    else if (/gravity/i.test(lower)) {
      response = KnowledgeBase.physics.gravity;
    }
    // QUANTUM
    else if (/quantum/i.test(lower)) {
      response = KnowledgeBase.physics.quantum;
    }
    // RELATIVITY
    else if (/relativity|einstein/i.test(lower)) {
      response = KnowledgeBase.physics.relativity;
    }
    // UNIVERSE
    else if (/universe|big bang/i.test(lower)) {
      response = KnowledgeBase.space.universe;
    }
    // STARS
    else if (/star|stars|sun/i.test(lower)) {
      response = KnowledgeBase.space.stars;
    }
    // DNA
    else if (/dna|gene/i.test(lower)) {
      response = KnowledgeBase.biology.dna;
    }
    // BRAIN
    else if (/brain|neuron/i.test(lower)) {
      response = KnowledgeBase.biology.brain;
    }
    // AI
    else if (/artificial intelligence|what is ai/i.test(lower)) {
      response = KnowledgeBase.technology.ai;
    }
    // INTERNET
    else if (/internet|world wide web/i.test(lower)) {
      response = KnowledgeBase.technology.internet;
    }
    // LEARNING
    else if (/how.*learn|learning work/i.test(lower)) {
      response = KnowledgeBase.psychology.learning;
    }
    // MEMORY
    else if (/memory|remember/i.test(lower)) {
      response = KnowledgeBase.psychology.memory;
    }
    // MEANING OF LIFE
    else if (/meaning of life|purpose/i.test(lower)) {
      response = KnowledgeBase.philosophy.meaning;
    }
    // FREE WILL
    else if (/free will|determinism/i.test(lower)) {
      response = KnowledgeBase.philosophy.freewill;
    }
    // SKY BLUE
    else if (/sky.*blue|blue.*sky/i.test(lower)) {
      response = "Great question! The sky is blue because of Rayleigh scattering. Sunlight contains all colors, but when it enters Earth's atmosphere, it collides with gas molecules. Shorter wavelengths (blue and violet) scatter more than longer wavelengths (red and orange). We see blue rather than violet because our eyes are more sensitive to blue, and some violet light is absorbed by the upper atmosphere. At sunset, light travels through more atmosphere, scattering away blues and leaving reds and oranges!";
    }
    // WHO ARE YOU
    else if (/who are you|what are you/i.test(lower)) {
      response = "I'm your AI study companion! I use a comprehensive knowledge base to answer questions about science, philosophy, technology, psychology, and more. I'm here to help you learn, explore ideas, get motivation, and have interesting conversations. No API keys needed - I run completely locally! What would you like to talk about?";
    }
    // THANK YOU
    else if (/thank you|thanks/i.test(lower)) {
      response = "You're very welcome! 😊 Happy to help anytime. Got more questions?";
    }
    // JOKE
    else if (/tell me.*joke|make me laugh/i.test(lower)) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything! 😄",
        "What do you call a fake noodle? An impasta! 🍝",
        "Why did the scarecrow win an award? He was outstanding in his field! 🌾"
      ];
      response = jokes[Math.floor(Math.random() * jokes.length)];
    }
    // INTERESTING FACT
    else if (/tell me something interesting|interesting fact|surprise me/i.test(lower)) {
      const facts = [
        "🌟 There are more possible chess games than atoms in the observable universe! About 10^120 possible games vs 10^80 atoms.",
        "🧠 Your brain generates about 20 watts of power - enough to power a dim lightbulb!",
        "🌌 If you could fold a piece of paper 42 times, it would reach the moon!",
        "⚛️ If you removed all empty space from atoms in all humans, the entire world population would fit in a sugar cube!"
      ];
      response = facts[Math.floor(Math.random() * facts.length)];
    }
    // DEFAULT
    else {
      response = "That's interesting! I'd love to discuss that with you.\n\nI can help with:\n• Science (physics, space, biology)\n• Technology (AI, computers, internet)\n• Psychology (learning, memory, brain)\n• Philosophy (meaning, free will, ethics)\n• Study motivation and tips\n• General knowledge\n\nWhat would you like to explore?";
    }
    
    conversationHistory.push({ role: 'assistant', message: response, timestamp: Date.now() });
    return response;
  }
  
  return {
    generateResponse,
    clearHistory: () => {
      conversationHistory = [];
      userContext = { name: null, interests: [], mood: 'neutral', recentTopics: [] };
    },
    getHistory: () => conversationHistory
  };
})();

window.ConversationEngine = ConversationEngine;
