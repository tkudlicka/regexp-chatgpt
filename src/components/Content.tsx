import 'solid-js';
import { createEffect, createSignal } from 'solid-js';
import PCRE from 'pcre-to-regexp'
import './Card.scss';
import Card from './Card';
import Sidebar from './Sidebar';
import Visualizaiton from './Visualization';
import toaster, { Toaster } from 'solid-toast';
import { createEditor } from './Codemirror';
import { EditorState } from '@codemirror/state';

function PlayIcon() {
    return (
      <svg class='play-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 494.148 494.148" fill="currentColor" xml:space="preserve"><path d="M405.284 201.188 130.804 13.28C118.128 4.596 105.356 0 94.74 0 74.216 0 61.52 16.472 61.52 44.044v406.124c0 27.54 12.68 43.98 33.156 43.98 10.632 0 23.2-4.6 35.904-13.308l274.608-187.904c17.66-12.104 27.44-28.392 27.44-45.884.004-17.48-9.664-33.764-27.344-45.864z"></path></svg>
    );
}


function RegulexController() {
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
        title=''
        sectionClassName='generator'
        header={<button onClick={(event) => handleAnalyze(event)}><span class='generate--text'>Generate regular expression {PlayIcon()}</span></button>}
      >
        <article class='editor multiline' ref={generatorRef} />
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
        sectionClassName='visualize'
        title='Visualize'
      >
        <Visualizaiton regex={regex} />
      </Card>
      <slot />
      <Toaster position="bottom-center"
        gutter={8} />
    </div>
  );
};

export default RegulexController;
