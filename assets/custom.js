
document.addEventListener('rebuy:cart.change', function(event){
    // Your custom script here
    setTimeout(changePriceFormat, 500);
    setTimeout(changePriceFormat, 1000);
  });
  
  document.addEventListener('rebuy:cart.loaded', function (event) {
    hideProgressBarWhenEmpty();
    setTimeout(changePriceFormat, 100);
  });
  
  document.addEventListener('rebuy:smartcart.show', function(event){
    console.log('Smart Cart opened', event.detail);
    // Your custom price formatting code here
    setTimeout(changePriceFormat, 500);
    setTimeout(changePriceFormat, 1000);
  });
  

  function changePriceFormat() {
    // Convert European-style prices (1.234,56) to US-style (1,234.56)
    const valueSpanSelectors = [
      '#rebuy-cart .rebuy-money span:not(.sr-only)',
      '.rebuy-money span:not(.sr-only)',
      '.rebuy-cart__flyout-subtotal-amount span'
    ];
    const wrapperSelectors = [
      '.money',
      '.price',
      '.product-price',
      '.rebuy-cart__flyout-subtotal-amount'
    ];
  
    console.log('changePriceFormat');
  
    const toUSFormat = function (text) {
      if (!text) return text;
  
      // First, convert European-style to dot-decimal (remove thousand separators and replace comma)
      const normalized = text.replace(
        /(\d{1,3}(?:[.\s\u00A0\u202F]\d{3})*|\d+),(\d{2})(?!\d)/g,
        function (_match, intPart, decPart) {
          const cleanInt = intPart.replace(/[.\s\u00A0\u202F]/g, '');
          return cleanInt + '.' + decPart;
        }
      );
  
      // Then, insert comma as thousands separator in the integer part
      // Example: 1234.56 → 1,234.56
      return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
  
    const updateText = function (el) {
      const before = el.textContent;
      const after = toUSFormat(before);
      if (before !== after) {
        el.textContent = after;
      }
    };
  
    // Update numeric value spans
    document.querySelectorAll(valueSpanSelectors.join(',')).forEach(updateText);
  
    // Update simple wrappers (skip ones with nested spans)
    document.querySelectorAll(wrapperSelectors.join(',')).forEach(function (el) {
      if (el.querySelector('span')) return;
      updateText(el);
    });
  }
  