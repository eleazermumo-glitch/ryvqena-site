export type Quiz = { q: string; options: string[]; answer: number; why: string };
export type Lesson = { id: string; title: string; minutes: number; body: string[]; points: string[]; quiz: Quiz[] };
export type Course = { id: string; title: string; level: string; summary: string; lessons: Lesson[] };

/** Pass mark for each lesson check. */
export const PASS = 2;

export const courses: Course[] = [
  {
    id: 'ai-ml',
    title: 'AI and Machine Learning Fundamentals',
    level: 'Beginner',
    summary: 'What machine learning is, how models learn from data, how to judge them, and how to use AI tools responsibly.',
    lessons: [
      {
        id: 'ai-1',
        title: 'What machine learning is',
        minutes: 8,
        body: [
          'In ordinary programming you write the rules and give the program data; it produces answers. In machine learning you flip this: you give the computer data together with the answers, and it works out the rules itself. Those learned rules are called a model.',
          'There are three main families. In supervised learning every example comes with a correct label, such as an email marked spam or not spam, and the model learns to predict labels for new examples. In unsupervised learning there are no labels, and the model looks for structure on its own, for example grouping customers with similar habits. In reinforcement learning an agent tries actions and is rewarded or penalised, and learns which actions earn the most reward over time.',
          'Machine learning is a good fit when the rules are too many or too fuzzy to write by hand, such as recognising handwriting or ranking search results. It is a poor fit when a few clear rules already solve the problem, or when you have too little data.',
        ],
        points: ['A model is a set of rules learned from data.', 'Supervised learning uses labelled examples; unsupervised finds patterns without labels.', 'If simple rules solve the problem, you may not need machine learning.'],
        quiz: [
          { q: 'What is the main difference from ordinary programming?', options: ['The computer learns the rules from data and answers', 'The computer runs faster', 'Humans write more rules', 'No data is needed'], answer: 0, why: 'In machine learning the rules are learned from examples instead of being written by hand.' },
          { q: 'Sorting emails into spam and not spam, using emails already marked by people, is an example of:', options: ['Unsupervised learning', 'Supervised learning', 'Reinforcement learning', 'Rule writing'], answer: 1, why: 'The examples carry labels (spam or not), which is what makes it supervised.' },
          { q: 'Grouping shoppers by similar buying habits, with no labels given, is:', options: ['Supervised learning', 'Reinforcement learning', 'Unsupervised learning', 'Not possible'], answer: 2, why: 'There are no labels, and the model finds the groups itself.' },
        ],
      },
      {
        id: 'ai-2',
        title: 'Data, features and labels',
        minutes: 9,
        body: [
          'A model is only as good as the data it learns from. Each example is described by features, the inputs the model sees (a car’s age, mileage and engine size), and, in supervised learning, a label, the answer you want predicted (its resale price).',
          'Data is normally split into three parts. The training set is what the model learns from. The validation set is used while you build, to compare settings and choose between versions. The test set is kept locked away until the end, to give an honest estimate of how the final model behaves on data it has never seen. If test data leaks into training, the result looks better than it really is. This is called data leakage.',
          'Data also carries the biases of how it was collected. If a speech model is trained mostly on one accent, it will work worse for others. Before training, ask who and what is missing from the data, and whether it represents the people who will actually use the system.',
        ],
        points: ['Features are the inputs; the label is the answer to predict.', 'Keep a test set untouched until the end.', 'Check who is missing from your data before you train.'],
        quiz: [
          { q: 'In a model that predicts house prices, the price is the:', options: ['Feature', 'Label', 'Test set', 'Bias'], answer: 1, why: 'The price is the answer being predicted, so it is the label.' },
          { q: 'What is the test set for?', options: ['Training the model', 'Choosing settings while building', 'An honest final check on unseen data', 'Cleaning the data'], answer: 2, why: 'It is kept aside so the final score reflects data the model never saw.' },
          { q: 'A voice assistant trained mostly on one accent works poorly for others. This is mainly a problem of:', options: ['Data that does not represent its users', 'Too little computing power', 'A slow internet connection', 'Too many features'], answer: 0, why: 'The training data did not represent everyone who uses the system.' },
        ],
      },
      {
        id: 'ai-3',
        title: 'Training and judging a model',
        minutes: 10,
        body: [
          'Training means adjusting the model so that its predictions get closer to the correct answers. A loss function measures how wrong the predictions are, and training tries to make that number smaller.',
          'A model can learn the training data too well, memorising noise instead of the pattern. This is overfitting: scores are excellent on training data and poor on new data. The opposite, underfitting, is a model too simple to capture the pattern at all. Comparing performance on training and validation data shows which one you have.',
          'Accuracy, the share of predictions that are correct, can mislead. Imagine a disease that affects 1 in 100 people. A model that always answers “healthy” is 99% accurate and useless. For cases like this, look at precision (of the cases flagged, how many were really positive) and recall (of all the real positives, how many were found). Which one matters more depends on the cost of each kind of mistake.',
        ],
        points: ['Loss measures how wrong a model is; training lowers it.', 'Overfitting: great on training data, poor on new data.', 'Accuracy can hide failure when one outcome is rare; check precision and recall.'],
        quiz: [
          { q: 'A model scores 99% on training data but 70% on validation data. This suggests:', options: ['Underfitting', 'Overfitting', 'A perfect model', 'Too little training data was used for testing'], answer: 1, why: 'A large gap between training and validation scores is the classic sign of overfitting.' },
          { q: 'A disease affects 1 in 100 people. A model that always says “healthy” has accuracy of about:', options: ['1%', '50%', '99%', '0%'], answer: 2, why: 'It is right for the 99 healthy people, which is why accuracy alone misleads here.' },
          { q: 'Recall answers the question:', options: ['Of all real positives, how many did we find?', 'How fast is the model?', 'Of the cases flagged, how many were real?', 'How much data was used?'], answer: 0, why: 'Recall is the share of real positives that the model found. The other definition is precision.' },
        ],
      },
      {
        id: 'ai-4',
        title: 'Using AI responsibly',
        minutes: 8,
        body: [
          'Large language models, the technology behind AI chat assistants, are trained to predict the next piece of text. This makes them fluent, but fluent is not the same as correct. They can state false things with confidence, sometimes called hallucination, so anything that matters should be checked against a reliable source.',
          'Be careful with what you put in. Do not paste passwords, personal data about other people, or confidential business material into a tool unless you know how it is stored and used. In Kenya, the Data Protection Act, 2019 sets rules for handling personal data and is overseen by the Office of the Data Protection Commissioner.',
          'Keep a person responsible for decisions that affect people, such as hiring, lending or medical care. Use AI to draft, summarise and suggest, then review the output yourself, and be open about where AI was used.',
        ],
        points: ['Fluent output can still be wrong; verify what matters.', 'Do not share personal or confidential data with tools you do not understand.', 'A person stays accountable for decisions that affect other people.'],
        quiz: [
          { q: 'Why can an AI assistant give a confident but wrong answer?', options: ['It is built to lie', 'It predicts likely text, which is not the same as checking facts', 'It has no data', 'It only works offline'], answer: 1, why: 'Language models generate likely text; they do not automatically verify facts.' },
          { q: 'Which is the safest thing to paste into a public AI tool?', options: ['A customer’s ID number', 'Your bank password', 'A general question about how HTTP works', 'A confidential contract'], answer: 2, why: 'A general technical question holds no personal or confidential data.' },
          { q: 'For a decision such as approving a loan, the best practice is to:', options: ['Let the AI decide alone', 'Keep a person accountable and review the AI’s suggestion', 'Hide that AI was used', 'Skip checking the data'], answer: 1, why: 'Decisions affecting people need human responsibility and review.' },
        ],
      },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud Architecture Basics',
    level: 'Beginner',
    summary: 'The building blocks of the cloud: service models, compute and storage, networking and security, reliability and cost.',
    lessons: [
      {
        id: 'cl-1',
        title: 'What “the cloud” means',
        minutes: 8,
        body: [
          'Cloud computing means renting computing resources over the internet from a provider, and paying for what you use, instead of buying and running your own servers. You can start in minutes and scale up or down as demand changes.',
          'Services come in three common layers. Infrastructure as a Service (IaaS) gives you virtual machines, storage and networks to manage yourself. Platform as a Service (PaaS) also manages the operating system and runtime, so you only deploy your code. Software as a Service (SaaS) is a finished application, such as email or an accounting tool, used through a browser.',
          'Providers run data centres in regions, and each region has several availability zones, which are separate locations with their own power and networking. Spreading an application across zones keeps it running if one fails. Security is a shared responsibility: the provider secures the data centre and hardware, and you secure your accounts, data and configuration.',
        ],
        points: ['Pay for what you use; scale up and down.', 'IaaS, PaaS and SaaS differ in how much the provider manages.', 'Provider secures the cloud; you secure what you put in it.'],
        quiz: [
          { q: 'Which model gives you only your code to manage, with the platform handled for you?', options: ['IaaS', 'PaaS', 'On-premises', 'None of these'], answer: 1, why: 'PaaS manages the operating system and runtime so you deploy only your application.' },
          { q: 'Why spread an application across availability zones?', options: ['To make it look bigger', 'So it keeps running if one location fails', 'To avoid paying', 'To remove the need for backups'], answer: 1, why: 'Zones fail independently, so using several improves availability.' },
          { q: 'Under shared responsibility, who is responsible for choosing strong passwords on your cloud account?', options: ['The provider', 'The customer', 'The internet provider', 'Nobody'], answer: 1, why: 'Customers secure their own accounts, data and settings.' },
        ],
      },
      {
        id: 'cl-2',
        title: 'Compute, storage and databases',
        minutes: 10,
        body: [
          'Compute is where your code runs. A virtual machine behaves like a full computer and gives you the most control. A container packages an application with what it needs, so it runs the same everywhere and starts quickly. Serverless functions run small pieces of code only when triggered, and you pay per execution without managing servers.',
          'Storage comes in kinds. Object storage holds files such as images and backups at large scale and low cost, and is accessed through web requests. Block storage behaves like a hard disk attached to a machine, which suits operating systems and databases. File storage is a shared folder that many machines can use.',
          'For databases, relational (SQL) databases store data in tables with a fixed structure and are strong for transactions, such as payments. NoSQL databases trade some of that structure for flexibility and scale, and suit varied or very large data. Pick based on how the data is shaped and used, not on fashion.',
        ],
        points: ['VM = most control, container = portable, serverless = pay per run.', 'Object storage for files at scale; block storage for disks.', 'SQL for structured, transactional data; NoSQL for flexible or very large data.'],
        quiz: [
          { q: 'You need to store millions of user photos cheaply. The best fit is:', options: ['Block storage on one machine', 'Object storage', 'A spreadsheet', 'Serverless compute'], answer: 1, why: 'Object storage is designed for large numbers of files at low cost.' },
          { q: 'Which option charges you per run of a small piece of code, with no servers to manage?', options: ['Virtual machine', 'Block storage', 'Serverless function', 'Relational database'], answer: 2, why: 'Serverless functions run on demand and are billed per execution.' },
          { q: 'Payments need strict, reliable transactions. A good starting choice is:', options: ['A relational (SQL) database', 'Object storage', 'A text file', 'Email'], answer: 0, why: 'Relational databases are built for consistent transactions.' },
        ],
      },
      {
        id: 'cl-3',
        title: 'Networking and security',
        minutes: 10,
        body: [
          'A virtual private network (VPC) is your own isolated network inside the cloud. You divide it into subnets. Public subnets hold things that must be reachable from the internet, such as a load balancer. Private subnets hold things that should not be, such as databases. A load balancer spreads incoming traffic across several servers so no single one is overwhelmed.',
          'Access should follow least privilege: give each person and each program only the permissions it needs, and no more. Use identity and access management to grant roles, and never share one account between people. Turn on multi-factor authentication (MFA), especially for administrators.',
          'Protect data in two states. Encryption in transit (HTTPS/TLS) protects data moving across networks. Encryption at rest protects data stored on disks. Keep secrets such as API keys out of source code, and store them in a secrets manager instead.',
        ],
        points: ['Put databases in private subnets; expose only what must be public.', 'Least privilege and MFA for every account.', 'Encrypt in transit and at rest; keep secrets out of code.'],
        quiz: [
          { q: 'Where should a database normally live?', options: ['A public subnet open to everyone', 'A private subnet', 'Inside the website’s source code', 'On a staff laptop'], answer: 1, why: 'Databases should not be directly reachable from the internet.' },
          { q: 'Least privilege means:', options: ['Everyone is an administrator', 'Each user gets only the permissions they need', 'Passwords are shared', 'No one can sign in'], answer: 1, why: 'Limiting permissions limits the damage from mistakes and stolen accounts.' },
          { q: 'Where should an API key be stored?', options: ['In the public code repository', 'In a secrets manager', 'In an email to the team', 'In the page’s HTML'], answer: 1, why: 'Secrets belong in a secrets manager, never in code or pages.' },
        ],
      },
      {
        id: 'cl-4',
        title: 'Reliability and cost',
        minutes: 9,
        body: [
          'Reliable systems assume that parts will fail. Remove single points of failure by running at least two copies of anything important, in different zones, behind a load balancer. Autoscaling adds servers when demand rises and removes them when it falls, which also controls cost.',
          'Backups are your safety net. A common rule is 3-2-1: keep three copies of your data, on two different kinds of storage, with one stored offsite. A backup you have never restored is only a hope, so test restores. Two measures guide planning: the recovery point objective (RPO) is how much recent data you can afford to lose, and the recovery time objective (RTO) is how long you can be down.',
          'Watch what you cannot see. Monitoring and alerts tell you about errors and slowness before users do. For cost, tag resources by project, set budgets with alerts, switch off what you are not using, and review the bill monthly. Cost surprises usually come from forgotten resources.',
        ],
        points: ['Run more than one copy across zones to avoid single points of failure.', '3-2-1 backups, and test the restore.', 'RPO = data you can lose; RTO = time you can be down.'],
        quiz: [
          { q: 'The 3-2-1 backup rule means:', options: ['3 copies, 2 kinds of storage, 1 offsite', '3 servers, 2 users, 1 password', '3 days, 2 hours, 1 minute', '3 clouds, 2 regions, 1 zone'], answer: 0, why: 'Three copies, on two media types, with one kept offsite.' },
          { q: 'RTO describes:', options: ['How much data you can lose', 'How long you can be down', 'How many users you have', 'How big your bill is'], answer: 1, why: 'Recovery time objective is the acceptable downtime. RPO is the acceptable data loss.' },
          { q: 'Which habit best prevents surprise cloud bills?', options: ['Ignoring the bill', 'Budgets with alerts and switching off unused resources', 'Running everything at maximum size', 'Disabling monitoring'], answer: 1, why: 'Budgets, alerts and clean-up catch forgotten resources early.' },
        ],
      },
    ],
  },
];
