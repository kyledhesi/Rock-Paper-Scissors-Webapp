# Rock Paper Scissors

A browser Rock Paper Scissors game, deployed to AWS through a fully automated
pipeline. The game itself is simple — the point of the project was
to build the CI/CD pipeline around it for learning.

## How it's deployed

Everything is provisioned with Terraform and shipped by GitHub Actions

The infrastructure is an S3 bucket holding the static site, with CloudFront in
front of it as the CDN.

On every push, the workflow installs dependencies, runs the Jest suite, builds
the site, and syncs it to S3. If the tests fail, nothing deploys.

**Stack:** Terraform, GitHub Actions, S3, CloudFront, Node.js, Jest

## Running it locally

Open `index.html` in a browser

To run the tests you'll need Node.js:

```bash
npm install
npm test           
```

Tests live in `tests/`:

- `determineWinner.test.js` — the win/lose/draw logic, all nine matchups
- `computerTurn.test.js` — random move selection, mocked and unmocked
- `playGame.test.js` — a full round against a real DOM, including score tracking
  and button clicks

## Deploying it yourself

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

To tear it all down:

```bash
terraform destroy
```