const { exec } = require("child_process");

console.log("Building UI...");
exec("npm run build", (buildError, buildStdout, buildStderr) => {
  if (buildError) {
    console.error(`Build error: ${buildError.message}`);
    process.exit(1);
  }
  if (buildStderr) {
    console.error(`Build stderr: ${buildStderr}`);
  }
  console.log(`Build stdout: ${buildStdout}`);
  
  console.log("Deploying UI to Vercel...");

  exec("vercel --prod", (deployError, deployStdout, deployStderr) => {
    if (deployError) {
      console.error(`Deploy error: ${deployError.message}`);
      process.exit(1);
    }
    console.log(`Deploy stdout: ${deployStdout}`);
    if (deployStderr) {
      console.error(`Deploy stderr: ${deployStderr}`);
    }
    console.log("UI deployed successfully!");
  });
});
