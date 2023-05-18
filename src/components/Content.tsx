import 'solid-js';
import { createEffect, createSignal } from 'solid-js';
import PCRE from 'pcre-to-regexp'
import './Card.scss';
import Card from './Card';
import toaster, { Toaster } from 'solid-toast';
import { createEditor } from './Codemirror';
import { EditorState } from '@codemirror/state';
function RegulexController({
  addHistoryCallback
}: {
  addHistoryCallback: (query: string) => void,
}) {
  let [regex, setRegex] = createSignal("/([A-Z])\w+/g");
  let [matches, setMatches] = createSignal([]);
  let [matchString, setMatchString] = createSignal('test');
  let [expression, setExpresison] = createSignal('');
  async function postRequest() {
    const payload = await fetch('/api/bot', {
      method: 'POST',
      body: JSON.stringify({
        query: expression()
      }),
    });
    return await payload.json();
  }
  const { ref: expressionRef,editorView } = createEditor({
    value: regex(),
    oneLine: true,
    readOnly: true,
  });
  const handleAnalyze = async (e: MouseEvent) => {
    e.preventDefault();
    const response = await postRequest()
    toaster('Succesfuly created regular expression.');
    setRegex(response.regexp);
    const state = EditorState.create({
      ...editorView()?.state,
      doc: response.regexp,
    });
    editorView()?.setState(state);
  }

  async function setCurrentQuery(query: string) {
    setExpresison(query);
    const response = await postRequest()
    setExpresison(response.regexp);
    toaster('Build from history.');
  }
  createEffect(() => {
    try {
      let visualizeRegex;
      
      setMatches([]);
      try {
        visualizeRegex = PCRE(regex(), []);
      } catch (e) {
        visualizeRegex = new RegExp(regex());
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
  const { ref: editorMachRef } = createEditor({
    // The initial value of the editor
    value: matchString(),
    enableTabKey: true,
    onValueChange: (value) => setMatchString(value),
  });
  const { ref: generatorRef } = createEditor({
    value: expression(),
    placholder: 'write description what u need to match by regular expression',
    onValueChange: (value) => setExpresison(value),
  });

  function getMatchText(length: number) {
    if(length === 0) {
      return 'No matches'
    } else if (length === 1) {
      return length + ' match'
    }
    return length + ' matches'
  }
  return (
    <div class='content'>
      <Card
        title='Write me a reguler expression that match...'
        sectionClassName='generator'
        header={<button onClick={(event) => handleAnalyze(event)}>Run</button>}
      >
        <article class='editor multiline' ref={generatorRef}>
          
        </article>
      </Card>
      <Card
        sectionClassName='expression'
        title='Expression'
      >
        <div class ="editor" ref={expressionRef} />
      </Card>
      <Card
        sectionClassName='matches'
        title='Matches'
        header={<h2> {getMatchText(matches().length)}</h2>}
      >
        <article class="editor multiline" ref={editorMachRef} />
      </Card>
      <Card 
        title='Visualization'
        sectionClassName="visualization">
        
      </Card>
      <Toaster position="bottom-center"
        gutter={8} />
    </div>
  );
};

export default RegulexController;
