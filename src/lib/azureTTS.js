import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const REGION = process.env.AZURE_SPEECH_REGION;
const audioPath = './tmp/response.wav';
const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, REGION);
speechConfig.speechSynthesisVoiceName = 'en-US-AnaNeural';


export async function textToSpeech(text) {
  // Create the speech synthesizer.
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioPath);
  var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  return new Promise(async (resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      function (result) {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve(audioPath);
        } else {
          reject(result.errorDetails)
          console.error(
            'Speech synthesis canceled, ' +
              result.errorDetails +
              '\nDid you set the speech resource key and region values?'
          );
        }
        synthesizer.close();
        synthesizer = null;
      },
      function (err) {
        reject(err);
        console.trace('err - ' + err);
        synthesizer.close();
        synthesizer = null;
      }
    );
  });
}
