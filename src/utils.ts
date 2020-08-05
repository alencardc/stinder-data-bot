export function askQuestion(question: string): Promise<string> {
  var stdin = process.stdin, stdout = process.stdout;

  stdin.resume();
  stdout.write(question);

  return new Promise(res => {
    stdin.once('data', function(data) {
      res(data.toString().trim());
    });
  });
}
