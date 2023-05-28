import 'solid-js';
import { Component, JSXElement, children,createComputed,on } from 'solid-js';
import { createStore } from 'solid-js/store'


export const getSlots = (_children: JSXElement) => {
  const parts = children(() => _children)
  const [slots, setSlots] = createStore<Record<string, JSXElement>>({})
  createComputed(
    on(parts, () => {
      for (const part of parts.toArray() as unknown as SlotProps[]) {
        if (!part.name) {
          setSlots('default', () => part)
          continue
        }
        setSlots(part.name, () => part.children)
      }
    })
  )
  return slots
}

export const Slot: Component<SlotProps> = (props) => {
	return props as unknown as JSXElement
}

interface SlotProps {
	name: string
	children: JSXElement
}

interface SectionProps {
  sectionClassName: string,
  title?: string,
	children: JSXElement,
  header?: JSXElement
}

interface SectionProps {
  children: JSXElement
}
const CardComponent: Component<SectionProps> = (props)  => {
  const { title,sectionClassName } = props;
  const slots = getSlots(props.children);
  return (
    <section class={sectionClassName}>
      <header> 
        {title ? <h1 >{title}</h1> : null}
        {props?.header}
      </header>
      {slots.default}
    </section>
  );
};

export default CardComponent;
