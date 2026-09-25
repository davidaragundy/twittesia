// What a post or comment can be flagged for, after the categories most platforms and moderation
// models share (OpenAI's moderation categories, Llama Guard, Perspective). Each one is asked as
// its own yes/no question, so several can hold at once; the wording is the policy, so a change
// here changes what gets flagged.
export const MODERATION_CATEGORIES = [
  {
    value: "hate",
    label: "Hate speech",
    description: "Attacks on people for who they are.",
    instructions:
      "Does this post attack, dehumanize, demean or call for exclusion of people because of a protected attribute such as race, ethnicity, national origin, religion, caste, gender, sexual orientation, gender identity, disability or serious illness?",
    criteria: {
      true: "It targets people for a protected attribute with slurs, dehumanizing language, contempt or calls to exclude them.",
      false:
        "It does not attack anyone for who they are; criticizing ideas or beliefs, discussing or reporting on hate, or reclaiming a term about oneself is not hate.",
    },
  },
  {
    value: "harassment",
    label: "Harassment",
    description: "Insults, bullying and intimidation aimed at someone.",
    instructions:
      "Does this post insult, bully, degrade, intimidate or pile abuse onto a specific person or group of people?",
    criteria: {
      true: "It aims abuse at someone: name-calling, degrading remarks, humiliation, intimidation or encouraging others to go after them.",
      false:
        "It is not abusive toward anyone; disagreement, criticism of what someone did, or friendly teasing is not harassment.",
    },
  },
  {
    value: "violence",
    label: "Violence",
    description: "Threats, incitement and graphic violence.",
    instructions:
      "Does this post threaten violence, call for or celebrate violence against people or animals, or describe violence in graphic, gory detail?",
    criteria: {
      true: "It threatens or incites violence, praises a violent act, or dwells on gore and injury.",
      false:
        "It does not; reporting news, mentioning violence without glorifying it, fiction without gore, or a figure of speech is not violent content.",
    },
  },
  {
    value: "self_harm",
    label: "Self-harm",
    description: "Suicide, self-injury and eating disorders.",
    instructions:
      "Does this post express an intent to harm oneself, or encourage, instruct or glorify suicide, self-injury or disordered eating?",
    criteria: {
      true: "It expresses an intent or wish to self-harm, or encourages, instructs or romanticizes suicide, self-injury or disordered eating.",
      false:
        "It does not; talking about mental health, recovery or seeking help without detail or encouragement is not self-harm content.",
    },
  },
  {
    value: "sexual",
    label: "Sexual content",
    description: "Explicit sexual content and solicitation.",
    instructions:
      "Does this post contain explicit sexual content, describe sexual acts, or solicit sex? Any sexual content involving minors counts.",
    criteria: {
      true: "It is sexually explicit, describes sexual acts, solicits sex, or sexualizes minors in any way.",
      false:
        "It is not; romance, flirting without explicit detail, or discussing sexual health or identity is not sexual content.",
    },
  },
  {
    value: "dangerous",
    label: "Dangerous activities",
    description: "Weapons, drugs, crime and dangerous acts.",
    instructions:
      "Does this post give instructions for, or promote, making weapons, using or selling illegal drugs, committing crimes, or doing something likely to cause serious injury?",
    criteria: {
      true: "It helps with or encourages weapons, illegal drugs, crime or dangerous acts.",
      false:
        "It does not; discussing laws, news, history or safety, or mentioning these things in passing, is not dangerous content.",
    },
  },
  {
    value: "spam",
    label: "Spam or scam",
    description: "Scams, phishing and unsolicited promotion.",
    instructions:
      "Is this post a scam, phishing attempt, fraudulent offer, or unsolicited advertising or repetitive promotion?",
    criteria: {
      true: "It tries to trick people out of money or details, or pushes unsolicited ads, links or giveaways.",
      false:
        "It is an ordinary post; mentioning a product or sharing a link in conversation is not spam.",
    },
  },
] as const;
