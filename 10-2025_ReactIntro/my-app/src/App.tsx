    // src/App.tsx
    import React from 'react'; // React is needed for JSX to work
    import './MyFirstComponent.css'; // Import the CSS file
    import Greeting from './Greeting'; // Import the Greeting component
    import './Greeting.css'; // Import the CSS file for Greeting component styling
    import Counter from './Counter';   // Import our new Counter component
    import ProductList from './ProductList';

    // This is our first functional component
    function MyFirstComponent() {
      // TypeScript infers 'name' as string, 'year' as number, 'isDeveloper' as boolean
      const name = "Alice";
      const year = new Date().getFullYear();
      const isDeveloper = true;

      // An event handler function for our button
      // We explicitly type the 'event' parameter for safety, a good TypeScript practice.
      const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Button clicked!", event.currentTarget.textContent); // Accessing event properties
        alert(`Hello, ${name}! You clicked a button in ${year}.`);
      };

      const  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Input changed:", event.target.value);
      }

      return (
        // JSX must return a single root element. Here, it's a <div>.
        <div className="my-first-component">
          <h1>My First React Component (TypeScript Edition)!</h1>
          <p>This is a paragraph about {name}.</p>
          <p>The current year is: {year}.</p>

          {/* Embedding JavaScript expressions inside curly braces {} */}
          <p>2 + 2 = {2 + 2}</p>

          {/* Conditional rendering using the logical AND (&&) operator */}
          {isDeveloper && <p className="developer-message">You're a developer! Keep learning!</p>}

          {/* An input tag, which is self-closing in JSX */}
          <input type="text" onChange ={onInputChange}  placeholder="Type something..." className="text-input" />

          {/* A button with an onClick event handler */}
          <button onClick={handleButtonClick} className="action-button">
            Click Me!
          </button>

           {/* 1. Passing both required 'name' and optional 'message' */}
          <Greeting name="Students" message="Welcome to the TypeScript world!" />

          {/* 2. Passing only the required 'name' prop */}
          <Greeting name="Learners" />

          {/* 3. Passing different values */}
          <Greeting name="Innovators" message="Keep building awesome things!" />

          {/* Try uncommenting the line below. Your IDE/TypeScript compiler will show an error
              because 'name' expects a string, not a number. This is the power of types! */}
          {/* <Greeting name={123} message="This will cause a TypeScript error!" /> */}

          {/* Render our Counter component */}
          <Counter />

          <Counter /> {/* You can render multiple Counters, each will have its own independent state! */}
          <p className="info-note">
            Notice how each counter above maintains its own count independently. This is because state is local to each component instance.
          </p>
          <ProductList /> {/* Render our ProductList component */}  
        </div>
      );
    }

    // Export the component so it can be used in other files (like index.tsx, which renders App.tsx)
    export default MyFirstComponent;