import 'solid-js';
import { createEffect, createSignal } from 'solid-js';
import PCRE from 'pcre-to-regexp'
import { createEditor } from './Codemirror';
import Card from './Card';
function RegulexController({
  regexp
}: {
  regexp: string
}) {
  const [matchString, setMatchString] = createSignal('test');
  const [matches, setMatches] = createSignal([]);

  const { ref: editorMachRef } = createEditor({
    // The initial value of the editor
    value: matchString(),
    enableTabKey: true,
    showMatches:  true,
    onValueChange: (value) => setMatchString(value),
  });
  createEffect(() => {
    try {
      let visualizeRegex;
      
      setMatches([]);
      try {
        visualizeRegex = PCRE(regexp, []);
      } catch (e) {
        visualizeRegex = new RegExp(regexp);
      }
      let m;
      const tempMatches: RegExpExecArray[] = [];
      const string = matchString();
      while ((m = visualizeRegex.exec(string)) !== null) {
        if(m.index === visualizeRegex.lastIndex) {
          visualizeRegex.lastIndex++;
        }
        tempMatches.push(m);
      }
      setMatches(tempMatches);
    } catch (e) {
      console.log(e)
    }
  }, []);
  function getMatchText(length: number) {
    if(length === 0) {
      return 'No matches'
    } else if (length === 1) {
      return length + ' match'
    }
    return length + ' matches'
  }
  return (
    <Card
      title='Matches'
      sectionClassName='matches'
    >
      <article class="editor multiline" ref={editorMachRef} />
    </Card>
  );
};

export default RegulexController;
