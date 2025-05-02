<!-- 
  Question
  In Svelte 5 TypeScript for <button use:tooltip={'print to PDF file'}>print</button> 
  create tooltip action that accepts a string as an argument, sets the button's CSS 
  position= 'relative', creates a const div:HTMLDivElement=document.createElement('div')  
  with CSS position=absolute, display:none and using import {fade} from 'svelte/transition'  
  amend the div with transition:fade={{
    delay: 250,
    duration: 500,
    easing: (x) => x,
    }} and as div.innerHTML implement a code block {#if visible}div with CSS display:block 
  {/if} 
  with div mouseenter and mouseleave that toggle the visible boolean
  I added <script> tag
-->
<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Action } from 'svelte/action';
  import { cubicInOut } from 'svelte/easing';

  let delay = 250,
    duration = 1000,
    baseScale = 0,
    translateX = '-2rem',
    translateY = '-120%';
  const tooltip: Action<HTMLDivElement, string> = (
    node: HTMLDivElement,
    text: string,
  ) => {
    // Set button position to relative
    node.style.position = 'relative';

    // Create tooltip div
    const tooltipDiv: HTMLDivElement = document.createElement('div');
    tooltipDiv.style.position = 'absolute';
    tooltipDiv.style.display = 'none';
    tooltipDiv.style.zIndex = '10';
    // Add any additional default styles (e.g., background, padding, etc.)
    tooltipDiv.style.background = '#333';
    tooltipDiv.style.color = '#fff';
    tooltipDiv.style.padding = '4px 8px';
    tooltipDiv.style.borderRadius = '4px';
    tooltipDiv.style.top = '100%';
    tooltipDiv.style.left = '50%';
    tooltipDiv.style.transform = 'translateX(-50%)';
    tooltipDiv.style.whiteSpace = 'nowrap';
    tooltipDiv.innerText = text;
    tooltipDiv.style.transition = `fadeScale${delay}, ${duration}, easing:cubicInOut, ${baseScale}, ${translateX}, ${translateY}`;

    // Initialize visibility state
    let visible = false;

    // tooltipDiv.innerHTML += `
    //   transition:fadeScale={{
    //     delay,
    //     duration,
    //     easing: cubicInOut,
    //     baseScale,
    //     translateX,
    //     translateY,
    //   }}
    // `;
    // Function to update tooltip visibility
    const updateVisibility = () => {
      tooltipDiv.style.display = visible ? 'block' : 'none';
    };

    // Event handlers
    const toggle = () => {
      visible = !visible;
      updateVisibility();
    };

    // Add event listeners
    node.addEventListener('mouseenter', toggle);
    node.addEventListener('mouseleave', toggle);

    // Append tooltip to button
    node.appendChild(tooltipDiv);

    // Cleanup on destroy
    return {
      destroy() {
        node.removeEventListener('mouseenter', toggle);
        node.removeEventListener('mouseleave', toggle);
        if (tooltipDiv.parentNode) {
          tooltipDiv.parentNode.removeChild(tooltipDiv);
        }
      },
    };
  };
</script>

<div use:tooltip={'Print PDF File'}>print file</div>
