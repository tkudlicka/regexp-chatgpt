import 'solid-js';
import { createEffect, createSignal } from 'solid-js';
import PCRE from 'pcre-to-regexp'
import regulex from '@tkudlicka/regulex'
import './Card.scss';
function RegulexController({
  regex
}:  { 
  regex: string
}) {
  let container: HTMLDivElement
  let paper: any

  function getRegexFlags(re: RegExp) {
    var flags = "";
    flags += re.ignoreCase ? "i" : "";
    flags += re.global ? "g" : "";
    flags += re.multiline ? "m" : "";
    return flags;
  }

  createEffect(() => {
    if (!paper) {
      paper = regulex.Raphael(container, 0, 0);
    }
    try {
      let visualizeRegex;
      
      try {
        visualizeRegex = PCRE(regex, []);
      } catch (e) {
        visualizeRegex = new RegExp(regex);
      }
      regulex.visualize(regulex.parse(visualizeRegex.source), getRegexFlags(visualizeRegex), paper);
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
    <div class="Visualization" ref={container} />
  );
};

export default RegulexController;
