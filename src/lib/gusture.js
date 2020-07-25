export function enableGesture(element) {
  const contexts = Object.create(null)

  const MOUSE_SYMBOL = Symbol('mouse')

  if (document.ontouchstart !== null) {
    element.addEventListener('mousedown', event => {
      contexts[MOUSE_SYMBOL] = Object.create(null)
      start(event, contexts[MOUSE_SYMBOL])

      const mousemove = event => {
        move(event, contexts[MOUSE_SYMBOL])
      }

      const mouseup = event => {
        end(event, contexts[MOUSE_SYMBOL])
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
      }

      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
    })
  }

  element.addEventListener('touchstart', event => {
    for (const touch of event.changedTouches) {
      contexts[touch.identifier] = Object.create(null)
      start(touch, contexts[touch.identifier])
    }
  })

  element.addEventListener('touchmove', event => {
    for (const touch of event.changedTouches) {
      move(touch, contexts[touch.identifier])
    }
  })

  element.addEventListener('touchend', event => {
    for (const touch of event.changedTouches) {
      end(touch, contexts[touch.identifier])
    }
  })

  element.addEventListener('touchcancel', event => {
    for (const touch of event.changedTouches) {
      cancel(touch, contexts[touch.identifier])
    }
  })

  function start(point, context) {
    element.dispatchEvent(new CustomEvent('start', {
      detail: {
        startX: point.clientX,
        startY: point.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
      }
    }));
    context.startX = point.clientX;
    context.startY = point.clientY;
    context.moves = [];
    context.eventType = 'tap';
    context.timeoutHandler = setTimeout(() => {
      if (context.eventType === 'pan') {
        return;
      }
      context.eventType = 'press';
      element.dispatchEvent(new CustomEvent('pressstart'));
    }, 500);
  }

  function move(point, context) {
    const dx = point.clientX - context.startX;
    const dy = point.clientY - context.startY;
    if ((context.eventType !== 'pan') && (dx ** 2 + dy ** 2 > 100)) {
      if (context.eventType === 'press') {
        element.dispatchEvent(new CustomEvent('presscancel'));
      }
      context.eventType = 'pan';
      element.dispatchEvent(new CustomEvent('panstart', {
        detail: {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY
        }
      }));
    }
    
    if (context.eventType === 'pan') {
      context.moves = context.moves.filter(record => Date.now() - record.t < 300);
      context.moves.push({
        dx,
        dy,
        t: Date.now()
      });
      element.dispatchEvent(new CustomEvent('pan', {
        detail: {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY
        }
      }));
    }
  }

  function end(point, context) {
    if (context.eventType === 'tap') {
      element.dispatchEvent(new CustomEvent('tap'));
    } else if (context.eventType === 'press') {
      element.dispatchEvent(new CustomEvent('pressend'));
    } else if (context.eventType === 'pan') {
      const dx = point.clientX - context.startX;
      const dy = point.clientY - context.startY;
      const record = context.moves[0];
      const speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2 / (Date.now() - record.t));
      const isFlick = speed > 100;
      if (isFlick) {
        element.dispatchEvent(new CustomEvent('flick', {
          detail: {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            speed
          }
        }));
      }

      element.dispatchEvent(new CustomEvent('panend', {
        detail: {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed,
          isFlick
        }
      }));
    }
    clearTimeout(context.timeoutHandler);
  }

  function cancel(point, context) {
    element.dispatchEvent(new CustomEvent('canceled'))
    clearTimeout(context.timeoutHandler);
  }
}