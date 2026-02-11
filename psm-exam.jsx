import { useState, useEffect, useCallback, useRef } from "react";

const QUESTIONS = [
  { id: 1, category: "Scrum Theory", question: "Which statement most accurately describes Scrum?", type: "single", options: ["A process within which various techniques and methods are applied to develop complex products.", "A lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems.", "A methodology that provides detailed instructions for incrementally building software.", "A set of proven best practices for managing software development projects."], correct: [1], explanation: "Directly from the Scrum Guide 2020: 'Scrum is a lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems.' Scrum is explicitly not a process or methodology, but a framework." },
  { id: 2, category: "Scrum Theory", question: "Scrum is founded on two fundamental ways of thinking. Which are they?", type: "single", options: ["Agile thinking and iterative working", "Empiricism and lean thinking", "Predictive process management and continuous improvement", "Transparency and inspection"], correct: [1], explanation: "The Scrum Guide states: 'Scrum is founded on empiricism and lean thinking.' Transparency, inspection and adaptation are the three pillars — not the foundations themselves." },
  { id: 3, category: "Scrum Theory", question: "What are the three pillars that support Scrum?", type: "single", options: ["Commitment, Focus, Respect", "Transparency, Predictability, Adaptation", "Transparency, Inspection, Adaptation", "Planning, Inspection, Improvement"], correct: [2], explanation: "The three pillars of empirical process control are Transparency, Inspection, and Adaptation. 'Predictability' and 'Planning' do not belong here." },
  { id: 4, category: "Scrum Theory", question: "The Scrum framework is purposefully incomplete. What does this mean?", type: "single", options: ["Scrum must be supplemented with mandatory Agile practices such as user stories and story points.", "Scrum only defines the parts required to implement Scrum theory, and is built upon by the collective intelligence of the people using it.", "Scrum is too limited to work in practice without modifications.", "The framework must be extended with additional roles such as project manager and test manager."], correct: [1], explanation: "The Scrum Guide states: 'The Scrum framework is purposefully incomplete, only defining the parts required to implement Scrum theory. Scrum is built upon by the collective intelligence of the people using it.'" },
  { id: 5, category: "Scrum Theory", question: "When must an adjustment be made if an inspector determines that one or more aspects of a process deviate outside acceptable limits?", type: "single", options: ["During the next Scrum event.", "As soon as possible to minimize further deviation.", "When the Scrum Master approves it.", "During the Sprint Retrospective."], correct: [1], explanation: "The Scrum Guide states: 'The adjustment must be made as soon as possible to minimize further deviation.'" },
  { id: 6, category: "Scrum Theory", question: "True or False: Adaptation becomes more difficult when the people involved are not empowered or self-managing.", type: "single", options: ["True", "False"], correct: [0], explanation: "Directly from the Scrum Guide: 'Adaptation becomes more difficult when the people involved are not empowered or self-managing.'" },
  { id: 7, category: "Scrum Theory", question: "What does Scrum make visible?", type: "single", options: ["How much work each team member delivers individually.", "The relative efficacy of current management, environment, and work techniques, so that improvements can be made.", "Which team members perform best.", "How the team's velocity develops over time."], correct: [1], explanation: "The Scrum Guide states: 'Scrum makes visible the relative efficacy of current management, environment, and work techniques, so that improvements can be made.' Velocity is not a Scrum Guide concept." },
  { id: 8, category: "Scrum Theory", question: "Every event in Scrum is a formal opportunity to inspect and adapt. What happens if events are not operated as prescribed?", type: "single", options: ["The team must add an extra Sprint to catch up.", "Opportunities to inspect and adapt are lost.", "The Scrum Master is held accountable for the consequences.", "The team can decide to schedule other meetings as replacements."], correct: [1], explanation: "The Scrum Guide states: 'Failure to operate any events as prescribed results in lost opportunities to inspect and adapt.'" },
  { id: 9, category: "Scrum Theory", question: "Which statements about the Sprint are correct? (Choose two)", type: "multiple", selectCount: 2, options: ["A Sprint can be extended if the work is not finished.", "Each Sprint may be considered a short project.", "Sprints are fixed length events of one month or less.", "During the Sprint, scope may not be clarified."], correct: [1, 2], explanation: "Sprints are 'fixed length events of one month or less' and 'each Sprint may be considered a short project.' Sprints are never extended, and scope may be clarified." },
  { id: 10, category: "Scrum Theory", question: "Which statements about what applies 'During the Sprint' are correct? (Choose three)", type: "multiple", selectCount: 3, options: ["No changes are made that would endanger the Sprint Goal.", "Quality does not decrease.", "Scope is frozen and cannot be adjusted.", "The Product Backlog is refined as needed.", "The Sprint Goal can be changed mid-Sprint if the Product Owner wants."], correct: [0, 1, 3], explanation: "From the Scrum Guide: 'No changes are made that would endanger the Sprint Goal; Quality does not decrease; The Product Backlog is refined as needed.' Scope may be clarified and renegotiated." },
  { id: 11, category: "Scrum Theory", question: "In which type of complex environment does Scrum work best?", type: "single", options: ["Environments where requirements are fully known and stable.", "Environments where what will happen is unknown, and only what has already happened may be used for forward-looking decision making.", "Environments with simple, repeatable processes.", "Environments where a detailed upfront plan yields the best results."], correct: [1], explanation: "'In complex environments, what will happen is unknown. Only what has already happened may be used for forward-looking decision making.'" },
  { id: 12, category: "Scrum Theory", question: "What is the result of changing the core design or ideas of Scrum, leaving out elements, or not following the rules of Scrum?", type: "single", options: ["It makes Scrum more flexible and better applicable.", "It covers up problems and limits the benefits of Scrum, potentially even rendering it useless.", "It enables teams to tailor Scrum to their unique context.", "It has no significant effect as long as the pillars are respected."], correct: [1], explanation: "The Scrum Guide warns: 'covers up problems and limits the benefits of Scrum, potentially even rendering it useless.'" },
  { id: 13, category: "Scrum Theory", question: "How frequently should Scrum artifacts and progress toward a Sprint Goal be inspected?", type: "single", options: ["Daily during the Daily Scrum.", "Frequently, but inspection should not be so frequent that it gets in the way of the work.", "Only during formal Scrum events.", "Continuously, with every task that is completed."], correct: [1], explanation: "'Their inspection should not be so frequent that inspection gets in the way of the work.'" },
  { id: 14, category: "Scrum Theory", question: "True or False: Events are used in Scrum to create regularity and to minimize the need for meetings not defined in Scrum.", type: "single", options: ["True", "False"], correct: [0], explanation: "Directly from the Scrum Guide: 'Events are used in Scrum to create regularity and to minimize the need for meetings not defined in Scrum.'" },
  { id: 15, category: "Scrum Values", question: "What are the five Scrum values?", type: "single", options: ["Commitment, Courage, Focus, Openness and Respect", "Transparency, Courage, Commitment, Openness and Adaptation", "Commitment, Communication, Simplicity, Feedback and Courage", "Respect, Collaboration, Openness, Focus and Quality"], correct: [0], explanation: "The five Scrum values are: Commitment, Courage, Focus, Openness and Respect. Transparency is a pillar, not a value." },
  { id: 16, category: "Scrum Values", question: "When the Scrum values are embodied by the Scrum Team and the people they work with, what comes to life?", type: "single", options: ["The Agile Manifesto principles", "The empirical Scrum pillars of transparency, inspection, and adaptation, building trust", "The ability to always achieve the Sprint Goal", "The ability to define all requirements upfront"], correct: [1], explanation: "'When these values are embodied by the Scrum Team and the people they work with, the empirical Scrum pillars of transparency, inspection, and adaptation come to life building trust.'" },
  { id: 17, category: "Scrum Values", question: "Which Scrum value: 'The Scrum Team members have the courage to do the right thing, to work on tough problems'?", type: "single", options: ["Commitment", "Courage", "Focus", "Respect"], correct: [1], explanation: "This is the description of Courage in the Scrum Guide." },
  { id: 18, category: "Scrum Values", question: "Which Scrum value: 'The Scrum Team members personally commit to achieving the goals of the Scrum Team'?", type: "single", options: ["Commitment", "Courage", "Focus", "Openness"], correct: [0], explanation: "This is the description of Commitment in the Scrum Guide." },
  { id: 19, category: "Scrum Values", question: "Which Scrum value: 'The Scrum Team and its stakeholders are open about the work and the challenges'?", type: "single", options: ["Commitment", "Focus", "Openness", "Respect"], correct: [2], explanation: "This is the description of Openness in the Scrum Guide." },
  { id: 20, category: "Scrum Values", question: "What do the Scrum values give direction to?", type: "single", options: ["The technical architecture of the product.", "The Scrum Team's work, actions, and behavior.", "The processes and methods the team must follow.", "The way stakeholders communicate with the team."], correct: [1], explanation: "'These values give direction to the Scrum Team with regard to their work, actions, and behavior.'" },
  { id: 21, category: "Scrum Values", question: "Which Scrum value is best supported by the Scrum Team's primary focus being on the work of the Sprint to make the best possible progress toward the goals?", type: "single", options: ["Commitment", "Courage", "Focus", "Openness"], correct: [2], explanation: "'Their primary focus is on the work of the Sprint to make the best possible progress toward these goals.'" },
  { id: 22, category: "Scrum Values", question: "True or False: The decisions that are made, the steps taken, and the way Scrum is used should reinforce the Scrum values, not diminish or undermine them.", type: "single", options: ["True", "False"], correct: [0], explanation: "'The decisions that are made, the steps taken, and the way Scrum is used should reinforce these values, not diminish or undermine them.'" },
  { id: 23, category: "Scrum Team", question: "Who makes up the Scrum Team according to the Scrum Guide 2020?", type: "single", options: ["Product Owner, Scrum Master and Development Team", "Product Owner, Scrum Master and Developers", "Product Owner, Project Manager and Developers", "Product Owner, Scrum Master, Developers and stakeholders"], correct: [1], explanation: "Since 2020: 'The Scrum Team consists of one Scrum Master, one Product Owner, and Developers.' 'Development Team' was replaced by 'Developers'." },
  { id: 24, category: "Scrum Team", question: "The Scrum Guide 2020 no longer speaks of 'roles' but of:", type: "single", options: ["Functions", "Accountabilities", "Positions", "Titles"], correct: [1], explanation: "In the Scrum Guide 2020, 'roles' were replaced by 'accountabilities'. Common trick question." },
  { id: 25, category: "Scrum Team", question: "Which statement about the Scrum Team is correct?", type: "single", options: ["Within a Scrum Team, there are sub-teams and specialization hierarchies.", "The Scrum Team is a cohesive unit of professionals focused on one objective at a time, the Product Goal.", "The Scrum Team is a temporary project team dissolved after delivery.", "The Scrum Team reports to the Scrum Master who carries ultimate responsibility."], correct: [1], explanation: "'Within a Scrum Team, there are no sub-teams or hierarchies. It is a cohesive unit of professionals focused on one objective at a time, the Product Goal.'" },
  { id: 26, category: "Scrum Team", question: "The Scrum Team is self-managing. What does this mean exactly?", type: "single", options: ["They internally decide who does what, when, and how.", "They determine which Scrum events to use.", "They manage their own budget and set the Definition of Done themselves.", "They decide without input from the Product Owner which items to pick up."], correct: [0], explanation: "'They are self-managing, meaning they internally decide who does what, when, and how.' Note: the term is 'self-managing', not 'self-organizing' (2017 term)." },
  { id: 27, category: "Scrum Team", question: "Who is accountable for creating a valuable, useful Increment every Sprint?", type: "single", options: ["The Developers", "The Product Owner", "The Scrum Master", "The entire Scrum Team"], correct: [3], explanation: "'The entire Scrum Team is accountable for creating a valuable, useful Increment every Sprint.' Important 2020 change — the entire team, not just Developers." },
  { id: 28, category: "Scrum Team", question: "What is the recommended size of a Scrum Team?", type: "single", options: ["3 to 9 people, excluding Scrum Master and Product Owner", "Typically 10 or fewer people", "Exactly 7 people (plus or minus 2)", "5 to 11 people"], correct: [1], explanation: "'Typically 10 or fewer people.' In 2020, PO and SM count toward this number." },
  { id: 29, category: "Scrum Team", question: "Which three activities are part of Product Backlog management? (Choose three)", type: "multiple", selectCount: 3, options: ["Developing and explicitly communicating the Product Goal.", "Creating and clearly communicating Product Backlog items.", "Ordering Product Backlog items.", "Assigning Product Backlog items to individual Developers.", "Estimating the size of Product Backlog items."], correct: [0, 1, 2], explanation: "PB management includes developing the Product Goal, creating PBIs, ordering PBIs, and ensuring the PB is transparent, visible and understood." },
  { id: 30, category: "Scrum Team", question: "The Product Owner is one person, not a committee. Who must respect their decisions for them to succeed?", type: "single", options: ["The Scrum Master", "The entire organization", "Only the Developers", "Only management"], correct: [1], explanation: "'For Product Owners to succeed, the entire organization must respect their decisions.'" },
  { id: 31, category: "Scrum Team", question: "What is the Scrum Master accountable for? (Choose two)", type: "multiple", selectCount: 2, options: ["Establishing Scrum as defined in the Scrum Guide.", "Assigning work to the Developers.", "The Scrum Team's effectiveness.", "Managing the Product Backlog."], correct: [0, 2], explanation: "'The Scrum Master is accountable for establishing Scrum as defined in the Scrum Guide' and 'accountable for the Scrum Team's effectiveness.'" },
  { id: 32, category: "Scrum Team", question: "How does the Scrum Master serve the Scrum Team? (Choose three)", type: "multiple", selectCount: 3, options: ["Coaching the team members in self-management and cross-functionality.", "Assigning tasks to team members based on their skills.", "Helping the Scrum Team focus on creating high-value Increments that meet the Definition of Done.", "Causing the removal of impediments to the Scrum Team's progress.", "Approving leave requests and capacity planning."], correct: [0, 2, 3], explanation: "Note: 'causes the removal of impediments' — not 'removes impediments'. The SM facilitates removal but doesn't always do it themselves." },
  { id: 33, category: "Scrum Team", question: "How does the Scrum Master serve the Product Owner? (Choose two)", type: "multiple", selectCount: 2, options: ["By managing the Product Backlog on behalf of the Product Owner.", "By helping find techniques for effective Product Goal definition and Product Backlog management.", "By helping the Scrum Team understand the need for clear and concise Product Backlog items.", "By communicating directly with stakeholders instead of the Product Owner."], correct: [1, 2], explanation: "The SM helps the PO by finding techniques and helping the team understand PBIs. Never takes over PB management." },
  { id: 34, category: "Scrum Team", question: "How does the Scrum Master serve the organization? (Choose two)", type: "multiple", selectCount: 2, options: ["By leading, training, and coaching the organization in its Scrum adoption.", "By reporting on team performance to management.", "By helping employees and stakeholders understand and enact an empirical approach for complex work.", "By acting as a gatekeeper between the team and management."], correct: [0, 2], explanation: "The SM serves the organization by leading Scrum adoption and helping understand an empirical approach." },
  { id: 35, category: "Scrum Team", question: "True or False: Scrum Masters are true leaders who serve the Scrum Team and the larger organization.", type: "single", options: ["True", "False"], correct: [0], explanation: "'Scrum Masters are true leaders who serve the Scrum Team and the larger organization.' Note: the 2020 Guide no longer uses the term 'servant-leader'." },
  { id: 36, category: "Scrum Team", question: "Which accountabilities belong specifically to the Developers? (Choose three)", type: "multiple", selectCount: 3, options: ["Creating a plan for the Sprint, the Sprint Backlog.", "Ordering the Product Backlog.", "Instilling quality by adhering to a Definition of Done.", "Holding each other accountable as professionals.", "Determining the Sprint Goal."], correct: [0, 2, 3], explanation: "Developers are accountable for the Sprint Backlog, adhering to DoD, and holding each other accountable. PB ordering is the PO's; Sprint Goal is the entire team." },
  { id: 37, category: "Scrum Team", question: "Who determines how much work is selected from the Product Backlog for a Sprint?", type: "single", options: ["The Product Owner", "The Scrum Master", "The Developers", "The entire Scrum Team"], correct: [2], explanation: "Only the Developers determine how much work is selected. No one else may pressure them." },
  { id: 38, category: "Scrum Team", question: "True or False: Cross-functional means the Scrum Team is optimized to work on a single technical layer.", type: "single", options: ["True", "False"], correct: [1], explanation: "False. Cross-functional means the team collectively has all skills necessary to create value each Sprint." },
  { id: 39, category: "Scrum Team", question: "If multiple Scrum Teams work on the same product, how many Product Backlogs should they use?", type: "single", options: ["One per Scrum Team", "One for all teams working on the same product", "One per component or technical layer", "This is determined per Sprint"], correct: [1], explanation: "There is always only one Product Backlog per product, regardless of team count." },
  { id: 40, category: "Scrum Team", question: "Who may cancel a Sprint?", type: "single", options: ["The Scrum Master", "The Developers", "The Product Owner", "The stakeholders"], correct: [2], explanation: "'Only the Product Owner has the authority to cancel the Sprint.' Only if the Sprint Goal becomes obsolete." },
  { id: 41, category: "Scrum Team", question: "If two Scrum Teams are added to a product previously built by one team, what is the immediate impact on the original team's productivity?", type: "single", options: ["Productivity immediately increases.", "Productivity will likely decrease in the short term.", "There is no effect on the original team.", "Productivity is immediately doubled."], correct: [1], explanation: "Adding teams introduces communication overhead and integration challenges, typically causing short-term productivity to decrease." },
  { id: 42, category: "Scrum Team", question: "Who is accountable for stakeholder engagement?", type: "single", options: ["The Scrum Master", "The Product Owner", "The Developers", "The entire Scrum Team"], correct: [1], explanation: "The Product Owner is accountable for stakeholder engagement." },
  { id: 43, category: "Scrum Team", question: "What is the best team structure for Scrum Teams that need to deliver integrated Increments?", type: "single", options: ["Each team works on only one technical layer.", "Each team is cross-functional with all skills to deliver end-to-end features.", "A separate integration team merges the output.", "One team does architecture, others implement."], correct: [1], explanation: "Scrum Teams must be cross-functional. Component teams and integration teams are anti-patterns." },
  { id: 44, category: "Scrum Team", question: "True or False: The Product Owner may delegate Product Backlog management to others, but remains accountable.", type: "single", options: ["True", "False"], correct: [0], explanation: "'The Product Owner may do the above work or may delegate the responsibility to others. Regardless, the Product Owner remains accountable.'" },
  { id: 45, category: "Scrum Events", question: "Which event initiates the Sprint by laying out the work to be performed?", type: "single", options: ["The Daily Scrum", "Sprint Planning", "The Sprint Retrospective of the previous Sprint", "Product Backlog Refinement"], correct: [1], explanation: "'Sprint Planning initiates the Sprint by laying out the work to be performed for the Sprint.'" },
  { id: 46, category: "Scrum Events", question: "Sprint Planning addresses three topics. Which are they? (Choose three)", type: "multiple", selectCount: 3, options: ["Topic One: Why is this Sprint valuable?", "Topic Two: What can be Done this Sprint?", "Topic Three: Who is accountable for each individual item?", "Topic Three: How will the chosen work get done?", "Topic One: How many story points fit into this Sprint?"], correct: [0, 1, 3], explanation: "The three topics: Why (Sprint Goal), What can be Done, and How. Story points are not a Scrum concept." },
  { id: 47, category: "Scrum Events", question: "Who crafts the Sprint Goal?", type: "single", options: ["The Product Owner", "The Developers", "The Scrum Master", "The entire Scrum Team"], correct: [3], explanation: "The Sprint Goal 'is created during Sprint Planning' by the 'entire Scrum Team'." },
  { id: 48, category: "Scrum Events", question: "What is the maximum timebox for Sprint Planning for a one-month Sprint?", type: "single", options: ["4 hours", "8 hours", "One working day", "There is no set timebox"], correct: [1], explanation: "Sprint Planning is timeboxed to maximum 8 hours for a one-month Sprint." },
  { id: 49, category: "Scrum Events", question: "What is the purpose of the Daily Scrum?", type: "single", options: ["To report progress to the Scrum Master.", "To inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary.", "To assign tasks for the upcoming day.", "To update the burndown chart."], correct: [1], explanation: "'The purpose of the Daily Scrum is to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary.'" },
  { id: 50, category: "Scrum Events", question: "The Daily Scrum is a 15-minute event. For whom is it intended?", type: "single", options: ["The entire Scrum Team", "The Developers of the Scrum Team", "The Developers and the Scrum Master", "Anyone interested in the progress"], correct: [1], explanation: "'The Daily Scrum is a 15-minute event for the Developers of the Scrum Team.'" },
  { id: 51, category: "Scrum Events", question: "True or False: The Developers must use the three fixed questions for the Daily Scrum ('What did I do yesterday?', etc.).", type: "single", options: ["True", "False"], correct: [1], explanation: "False. In 2020, the three questions were removed. Developers 'can select whatever structure and techniques they want.' Common trick question." },
  { id: 52, category: "Scrum Events", question: "True or False: The Daily Scrum is the only time Developers are allowed to adjust their plan.", type: "single", options: ["True", "False"], correct: [1], explanation: "'The Daily Scrum is not the only time Developers are allowed to adjust their plan. They often meet throughout the day.'" },
  { id: 53, category: "Scrum Events", question: "What is the purpose of the Sprint Review?", type: "single", options: ["The Scrum Team presents a demo and receives approval from stakeholders.", "To inspect the outcome of the Sprint and determine future adaptations.", "To evaluate individual team member performance.", "To formally hand over the Increment to the Product Owner."], correct: [1], explanation: "'The purpose of the Sprint Review is to inspect the outcome of the Sprint and determine future adaptations.' Not a demo or approval gate." },
  { id: 54, category: "Scrum Events", question: "True or False: The Sprint Review is a working session and the Scrum Team should avoid limiting it to a presentation.", type: "single", options: ["True", "False"], correct: [0], explanation: "'The Sprint Review is a working session and the Scrum Team should avoid limiting it to a presentation.'" },
  { id: 55, category: "Scrum Events", question: "What is the purpose of the Sprint Retrospective?", type: "single", options: ["To plan ways to increase quality and effectiveness.", "To update the Product Backlog based on lessons learned.", "To evaluate individual team member performance.", "To define the Definition of Done for the next Sprint."], correct: [0], explanation: "'The purpose of the Sprint Retrospective is to plan ways to increase quality and effectiveness.'" },
  { id: 56, category: "Scrum Events", question: "Which event concludes the Sprint?", type: "single", options: ["The Sprint Review", "The Sprint Retrospective", "The delivery of the Increment", "Sprint Planning for the next Sprint"], correct: [1], explanation: "'The Sprint Retrospective concludes the Sprint.'" },
  { id: 57, category: "Scrum Events", question: "What are the correct timeboxes for Sprint events within a one-month Sprint?", type: "single", options: ["Planning: 8h, Daily: 15m, Review: 4h, Retro: 3h", "Planning: 4h, Daily: 15m, Review: 4h, Retro: 3h", "Planning: 8h, Daily: 30m, Review: 2h, Retro: 3h", "Planning: 8h, Daily: 15m, Review: 8h, Retro: 4h"], correct: [0], explanation: "Maximum timeboxes for a one-month Sprint: Planning 8h, Daily 15m, Review 4h, Retro 3h." },
  { id: 58, category: "Scrum Events", question: "When does the second Sprint start?", type: "single", options: ["After management approves the first Sprint results.", "Immediately after the conclusion of the previous Sprint.", "Once the Product Owner finishes updating the Product Backlog.", "After a short break between Sprints."], correct: [1], explanation: "'A new Sprint starts immediately after the conclusion of the previous Sprint.' No breaks." },
  { id: 59, category: "Scrum Events", question: "Who participates in Sprint Planning?", type: "single", options: ["Only the Developers", "The Product Owner and the Developers", "The entire Scrum Team, potentially with invited advisors", "The entire Scrum Team and all stakeholders"], correct: [2], explanation: "Sprint Planning is performed by the entire Scrum Team. 'The Scrum Team may also invite other people to provide advice.'" },
  { id: 60, category: "Scrum Events", question: "True or False: Product Backlog Refinement is a formal Scrum event with a fixed timebox.", type: "single", options: ["True", "False"], correct: [1], explanation: "False. Refinement is an ongoing activity, not a formal event. Scrum has five events: Sprint, Planning, Daily, Review, Retro." },
  { id: 61, category: "Scrum Events", question: "When could a Sprint be cancelled?", type: "single", options: ["If the Developers feel the Sprint Goal is not achievable.", "If the Sprint Goal becomes obsolete.", "If a more urgent priority cannot wait.", "If half the Sprint has passed without significant progress."], correct: [1], explanation: "'A Sprint could be cancelled if the Sprint Goal becomes obsolete.' Only the Product Owner has authority." },
  { id: 62, category: "Scrum Events", question: "Who participates in the Sprint Retrospective?", type: "single", options: ["Only the Developers", "The Developers and the Scrum Master", "The entire Scrum Team", "The Scrum Team and key stakeholders"], correct: [2], explanation: "The entire Scrum Team participates. Stakeholders do not." },
  { id: 63, category: "Scrum Events", question: "During the Sprint Review, progress toward the Product Goal is discussed. Who participates?", type: "single", options: ["Only the Scrum Team", "The Scrum Team presents results to key stakeholders", "Only the Product Owner and stakeholders", "Only the Developers present to the Product Owner"], correct: [1], explanation: "'The Scrum Team presents the results of their work to key stakeholders and progress toward the Product Goal is discussed.'" },
  { id: 64, category: "Scrum Events", question: "True or False: The Product Owner must be present at the Daily Scrum for it to be valid.", type: "single", options: ["True", "False"], correct: [1], explanation: "False. The Daily Scrum is for the Developers. PO and SM only participate if actively working on Sprint Backlog items." },
  { id: 65, category: "Artifacts & Commitments", question: "What are the three Scrum artifacts and their associated commitments?", type: "single", options: ["Product Backlog → Sprint Goal, Sprint Backlog → Product Goal, Increment → Definition of Done", "Product Backlog → Product Goal, Sprint Backlog → Sprint Goal, Increment → Definition of Done", "Product Backlog → Product Goal, Sprint Backlog → Definition of Done, Increment → Sprint Goal", "Product Backlog → Velocity, Sprint Backlog → Sprint Goal, Increment → Release Plan"], correct: [1], explanation: "Product Backlog → Product Goal, Sprint Backlog → Sprint Goal, Increment → Definition of Done. Velocity and Release Plan are not Scrum concepts." },
  { id: 66, category: "Artifacts & Commitments", question: "What is the Product Goal?", type: "single", options: ["A detailed roadmap for the product.", "A future state of the product which can serve as a target for the Scrum Team to plan against.", "The collection of all completed features.", "The total amount of work remaining in the Product Backlog."], correct: [1], explanation: "'The Product Goal describes a future state of the product which can serve as a target for the Scrum Team to plan against.'" },
  { id: 67, category: "Artifacts & Commitments", question: "True or False: A Scrum Team may only work on a new Product Goal after the previous one has been fulfilled or abandoned.", type: "single", options: ["True", "False"], correct: [0], explanation: "'A Scrum Team must fulfill (or abandon) one objective before taking on the next.' Only one active Product Goal at a time." },
  { id: 68, category: "Artifacts & Commitments", question: "What is the Sprint Backlog composed of?", type: "single", options: ["Selected PBIs plus estimated hours per item.", "The Sprint Goal (why), the set of PBIs selected for the Sprint (what), and an actionable plan for delivering the Increment (how).", "All PBIs that fit based on velocity.", "A detailed plan created by the Scrum Master."], correct: [1], explanation: "'The Sprint Backlog is composed of the Sprint Goal (why), the set of Product Backlog items selected for the Sprint (what), as well as an actionable plan for delivering the Increment (how).'" },
  { id: 69, category: "Artifacts & Commitments", question: "The Sprint Backlog is a plan by and for whom?", type: "single", options: ["The entire Scrum Team", "The Developers", "The Product Owner", "The Scrum Master"], correct: [1], explanation: "'The Sprint Backlog is a plan by and for the Developers.'" },
  { id: 70, category: "Artifacts & Commitments", question: "What is the Definition of Done?", type: "single", options: ["The acceptance criteria for each individual PBI.", "A formal description of the state of the Increment when it meets the quality measures required for the product.", "The criteria the PO uses to approve the Sprint result.", "A list of all tasks that must be completed before Sprint end."], correct: [1], explanation: "'The Definition of Done is a formal description of the state of the Increment when it meets the quality measures required for the product.' Not acceptance criteria per PBI." },
  { id: 71, category: "Artifacts & Commitments", question: "If the Definition of Done is part of the standards of the organization, what must all Scrum Teams do?", type: "single", options: ["Follow it as a minimum.", "Create their own DoD independent of the organizational standard.", "Follow the organizational standard exactly, without additions.", "Let the Scrum Master decide which standard applies."], correct: [0], explanation: "'All Scrum Teams must follow it as a minimum.' Teams may add stricter criteria." },
  { id: 72, category: "Artifacts & Commitments", question: "True or False: Multiple Increments may be created within a Sprint, and an Increment may be delivered prior to the end of the Sprint.", type: "single", options: ["True", "False"], correct: [0], explanation: "'Multiple Increments may be created within a Sprint' and 'An Increment may be delivered to stakeholders prior to the end of the Sprint.'" },
  { id: 73, category: "Artifacts & Commitments", question: "What happens if a PBI does not meet the Definition of Done at the end of the Sprint?", type: "single", options: ["It is included in the Increment as 'partially done'.", "It cannot be released or even presented at the Sprint Review.", "The Sprint is extended until the item is finished.", "The Scrum Master decides whether to approve it anyway."], correct: [1], explanation: "'If a Product Backlog item does not meet the Definition of Done, it cannot be released or even presented at the Sprint Review. Instead, it returns to the Product Backlog.'" },
  { id: 74, category: "Artifacts & Commitments", question: "What enhances the transparency of an Increment?", type: "single", options: ["A detailed burndown chart.", "A clear Definition of Done that is understood by everyone.", "Daily progress reports to management.", "The use of story points for estimation."], correct: [1], explanation: "The Definition of Done creates transparency by providing a shared understanding of what work was completed." },
  { id: 75, category: "Artifacts & Commitments", question: "The Product Backlog is an ordered list. Who determines the ordering?", type: "single", options: ["Determined exclusively by the value of each item.", "The Product Owner, who is accountable for the ordering.", "The entire Scrum Team during Sprint Planning.", "The Developers based on technical complexity."], correct: [1], explanation: "Ordering is the Product Owner's accountability. The Scrum Guide does not prescribe specific ordering criteria." },
  { id: 76, category: "Artifacts & Commitments", question: "True or False: The Product Backlog is never complete. It exists as long as the product exists.", type: "single", options: ["True", "False"], correct: [0], explanation: "The Product Backlog is emergent and continuously evolves with the product." },
  { id: 77, category: "Scenarios", question: "Multiple Scrum Teams work on the same product. Must all their Increments be integrated every Sprint?", type: "single", options: ["Yes, but only for teams with dependencies.", "Yes, otherwise the PO and stakeholders cannot accurately inspect what has been delivered.", "No, each team delivers a separate Increment.", "No, integration takes place in a separate 'hardening Sprint'."], correct: [1], explanation: "All Increments must be integrated for meaningful inspection. 'Hardening Sprints' do not exist in Scrum." },
  { id: 78, category: "Scenarios", question: "A Scrum Master joins a new team. The team decides the Sprint Retrospective is unnecessary. What should the Scrum Master do?", type: "single", options: ["Respect the team's decision, as they are self-managing.", "Explain the importance and teach the team that all Scrum events are mandatory.", "Allow skipping the Retro for two Sprints as an experiment.", "Replace the Retro with a different improvement format."], correct: [1], explanation: "Self-management does not mean skipping Scrum events. The SM is accountable for establishing Scrum as defined in the Guide." },
  { id: 79, category: "Scenarios", question: "True or False: It is mandatory to release the Increment to production at the end of every Sprint.", type: "single", options: ["True", "False"], correct: [1], explanation: "False. The Increment must meet the DoD and be usable, but the Scrum Guide does not mandate a release every Sprint." },
  { id: 80, category: "Scenarios", question: "An organization implements Scrum but wants to adapt the terminology to match existing company terminology. What will likely happen?", type: "single", options: ["Scrum will be better accepted.", "No significant effect as long as principles remain intact.", "Benefits are limited and problems covered up, potentially rendering Scrum useless.", "Management will embrace Scrum more quickly."], correct: [2], explanation: "'Changing the core design or ideas of Scrum, leaving out elements, or not following the rules of Scrum, covers up problems and limits the benefits of Scrum, potentially even rendering it useless.'" }
];

const TOTAL_TIME = 60 * 60;
const PASS_PERCENTAGE = 85;

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function StartScreen({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #0a0e1a 0%, #121930 50%, #0d1224 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 680, width: "100%", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(99, 179, 237, 0.08)", border: "1px solid rgba(99, 179, 237, 0.15)", borderRadius: 100, padding: "8px 20px", marginBottom: 32 }}>
          <span style={{ fontSize: 18 }}>🎯</span>
          <span style={{ color: "#63b3ed", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Practice Exam</span>
        </div>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, color: "#fff", margin: "0 0 12px 0", lineHeight: 1.1, letterSpacing: -1 }}>PSM-I</h1>
        <p style={{ fontSize: "clamp(16px, 2.5vw, 22px)", color: "rgba(255,255,255,0.5)", margin: "0 0 48px 0", fontWeight: 400 }}>Professional Scrum Master I</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
          {[{ icon: "📝", label: "80 questions", sub: "Scrum Guide 2020" }, { icon: "⏱️", label: "60 minutes", sub: "45 sec per question" }, { icon: "✅", label: "85% to pass", sub: "68 of 80 correct" }].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px 16px" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.label}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{item.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px 28px", marginBottom: 24, textAlign: "left" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>Topics</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Scrum Theory & Pillars", "Scrum Values", "Scrum Team & Accountabilities", "Scrum Events", "Artifacts & Commitments", "Scenarios & Trick Questions"].map((t, i) => (
              <span key={i} style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.12)", color: "#63b3ed", fontSize: 12, fontWeight: 500, borderRadius: 8, padding: "6px 12px" }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)", borderRadius: 12, padding: "16px 20px", marginBottom: 40, textAlign: "left" }}>
          <span style={{ color: "#fbbf24", fontSize: 13, lineHeight: 1.6 }}>⚠️ <strong>Note:</strong> This practice exam follows the exact terminology of the Scrum Guide 2020. Read questions and answers carefully — subtle word choices often make the difference.</span>
        </div>
        <button onClick={onStart} style={{ background: "linear-gradient(135deg, #3182ce 0%, #2563eb 100%)", color: "#fff", border: "none", borderRadius: 14, padding: "18px 48px", fontSize: 17, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3, boxShadow: "0 4px 24px rgba(49, 130, 206, 0.35)", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.transform = "translateY(-2px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>Start exam →</button>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 16 }}>Based on the Scrum Guide 2020 by Ken Schwaber & Jeff Sutherland</p>
      </div>
    </div>
  );
}

function QuestionCard({ question, currentAnswer, onAnswer, index, total }) {
  const isMultiple = question.type === "multiple";
  const selected = currentAnswer || [];
  const toggleOption = (idx) => { if (isMultiple) { const n = selected.includes(idx) ? selected.filter(i => i !== idx) : [...selected, idx]; onAnswer(n); } else { onAnswer([idx]); } };
  const catColors = { "Scrum Theory": { bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.2)", text: "#818cf8" }, "Scrum Values": { bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", text: "#34d399" }, "Scrum Team": { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", text: "#fbbf24" }, "Scrum Events": { bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.2)", text: "#f472b6" }, "Artifacts & Commitments": { bg: "rgba(99,179,237,0.08)", border: "rgba(99,179,237,0.2)", text: "#63b3ed" }, "Scenarios": { bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)", text: "#fb923c" } };
  const cs = catColors[question.category] || catColors["Scrum Theory"];
  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "clamp(20px, 4vw, 36px)", maxWidth: 780, width: "100%", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <span style={{ background: cs.bg, border: `1px solid ${cs.border}`, color: cs.text, fontSize: 11, fontWeight: 600, borderRadius: 6, padding: "4px 10px", letterSpacing: 0.5 }}>{question.category}</span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Question {index + 1} of {total}</span>
        {isMultiple && <span style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)", color: "#fbbf24", fontSize: 11, fontWeight: 600, borderRadius: 6, padding: "4px 10px" }}>Choose {question.selectCount}</span>}
      </div>
      <h2 style={{ color: "#fff", fontSize: "clamp(16px, 2.2vw, 20px)", fontWeight: 600, lineHeight: 1.5, margin: "0 0 28px 0" }}>{question.question}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {question.options.map((opt, idx) => {
          const isSel = selected.includes(idx);
          return (<button key={idx} onClick={() => toggleOption(idx)} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 18px", borderRadius: 12, border: isSel ? "1px solid rgba(99,179,237,0.4)" : "1px solid rgba(255,255,255,0.06)", background: isSel ? "rgba(99,179,237,0.08)" : "rgba(255,255,255,0.015)", cursor: "pointer", textAlign: "left", transition: "all 0.15s", color: "#fff" }}>
            <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: isMultiple ? 6 : 12, border: isSel ? "2px solid #63b3ed" : "2px solid rgba(255,255,255,0.15)", background: isSel ? "#63b3ed" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, fontSize: 13, fontWeight: 700, color: isSel ? "#0a0e1a" : "rgba(255,255,255,0.3)" }}>{isSel ? "✓" : String.fromCharCode(65 + idx)}</span>
            <span style={{ fontSize: 15, lineHeight: 1.5, color: isSel ? "#fff" : "rgba(255,255,255,0.7)" }}>{opt}</span>
          </button>);
        })}
      </div>
    </div>
  );
}

function ReviewScreen({ questions, answers, flagged, onRetry, onBackToStart }) {
  const flaggedSet = new Set(flagged || []);
  const results = questions.map((q, i) => { const ua = answers[i] || []; const isCorrect = [...q.correct].sort().join(",") === [...ua].sort().join(","); return { ...q, userAns: ua, isCorrect, isFlagged: flaggedSet.has(i) }; });
  const score = results.filter(r => r.isCorrect).length;
  const pct = Math.round((score / questions.length) * 100 * 10) / 10;
  const passed = pct >= PASS_PERCENTAGE;
  const catStats = {};
  results.forEach(r => { if (!catStats[r.category]) catStats[r.category] = { total: 0, correct: 0 }; catStats[r.category].total++; if (r.isCorrect) catStats[r.category].correct++; });
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const filtered = filter === "all" ? results : filter === "wrong" ? results.filter(r => !r.isCorrect) : filter === "correct" ? results.filter(r => r.isCorrect) : results.filter(r => r.isFlagged);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #0a0e1a 0%, #121930 50%, #0d1224 100%)", padding: "clamp(16px, 4vw, 40px)", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "48px 24px", marginBottom: 32 }}>
          <div style={{ fontSize: "clamp(56px, 10vw, 80px)", fontWeight: 800, color: passed ? "#34d399" : "#f87171", lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>{score} of {questions.length} correct</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, padding: "10px 24px", borderRadius: 100, background: passed ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${passed ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}` }}>
            <span style={{ fontSize: 20 }}>{passed ? "🎉" : "📚"}</span>
            <span style={{ color: passed ? "#34d399" : "#f87171", fontWeight: 700, fontSize: 15 }}>{passed ? "Passed!" : `Not passed (minimum ${PASS_PERCENTAGE}% required)`}</span>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, marginBottom: 32 }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 16 }}>Score by topic</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(catStats).map(([cat, stats]) => { const cp = Math.round((stats.correct / stats.total) * 100); return (<div key={cat}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{cat}</span><span style={{ color: cp >= 85 ? "#34d399" : cp >= 70 ? "#fbbf24" : "#f87171", fontSize: 13, fontWeight: 600 }}>{stats.correct}/{stats.total} ({cp}%)</span></div><div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}><div style={{ height: "100%", borderRadius: 2, width: `${cp}%`, background: cp >= 85 ? "#34d399" : cp >= 70 ? "#fbbf24" : "#f87171", transition: "width 0.5s" }} /></div></div>); })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {[{ key: "all", label: `All (${results.length})` }, { key: "wrong", label: `Wrong (${results.filter(r => !r.isCorrect).length})` }, { key: "correct", label: `Correct (${results.filter(r => r.isCorrect).length})` }, { key: "flagged", label: `🚩 Flagged (${results.filter(r => r.isFlagged).length})` }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: filter === f.key ? "1px solid rgba(99,179,237,0.3)" : "1px solid rgba(255,255,255,0.06)", background: filter === f.key ? "rgba(99,179,237,0.1)" : "rgba(255,255,255,0.02)", color: filter === f.key ? "#63b3ed" : "rgba(255,255,255,0.5)" }}>{f.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((q) => { const exp = expandedId === q.id; return (
              <div key={q.id} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${q.isCorrect ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)"}`, borderRadius: 14, overflow: "hidden" }}>
                <button onClick={() => setExpandedId(exp ? null : q.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", color: "#fff" }}>
                  <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: q.isCorrect ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{q.isCorrect ? "✓" : "✗"}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>#{q.id}</span>
                  {q.isFlagged && <span style={{ fontSize: 12, flexShrink: 0 }}>🚩</span>}
                  <span style={{ flex: 1, fontSize: 14, color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: exp ? "normal" : "nowrap" }}>{q.question}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 18, flexShrink: 0 }}>{exp ? "−" : "+"}</span>
                </button>
                {exp && (
                  <div style={{ padding: "0 20px 20px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ paddingTop: 16 }}>
                      {q.options.map((opt, idx) => { const isC = q.correct.includes(idx), isU = q.userAns.includes(idx); let bg = "transparent", bd = "1px solid rgba(255,255,255,0.04)"; if (isC && isU) { bg = "rgba(52,211,153,0.08)"; bd = "1px solid rgba(52,211,153,0.2)"; } else if (isC) { bg = "rgba(52,211,153,0.05)"; bd = "1px solid rgba(52,211,153,0.15)"; } else if (isU) { bg = "rgba(248,113,113,0.08)"; bd = "1px solid rgba(248,113,113,0.2)"; } return (<div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", borderRadius: 8, background: bg, border: bd, marginBottom: 6, fontSize: 14, lineHeight: 1.5 }}><span style={{ flexShrink: 0, width: 20, textAlign: "center" }}>{isC && isU ? "✅" : isC ? "✅" : isU ? "❌" : ""}</span><span style={{ color: isC ? "#34d399" : isU ? "#f87171" : "rgba(255,255,255,0.5)" }}>{opt}</span></div>); })}
                    </div>
                    <div style={{ marginTop: 14, padding: "14px 16px", background: "rgba(99,179,237,0.05)", border: "1px solid rgba(99,179,237,0.1)", borderRadius: 10, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.65)" }}><strong style={{ color: "#63b3ed" }}>Explanation:</strong> {q.explanation}</div>
                  </div>
                )}
              </div>); })}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 40, paddingBottom: 40, flexWrap: "wrap" }}>
          <button onClick={onRetry} style={{ background: "linear-gradient(135deg, #3182ce 0%, #2563eb 100%)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(49,130,206,0.3)" }}>Try again</button>
          <button onClick={onBackToStart} style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Back to start</button>
        </div>
      </div>
    </div>
  );
}

const STORAGE_KEY = "psm-exam-state";
async function saveState(state) { try { if (window.storage) { await window.storage.set(STORAGE_KEY, JSON.stringify(state)); } } catch (e) {} }
async function loadState() { try { if (window.storage) { const r = await window.storage.get(STORAGE_KEY); return r ? JSON.parse(r.value) : null; } } catch (e) {} return null; }
async function clearState() { try { if (window.storage) { await window.storage.delete(STORAGE_KEY); } } catch (e) {} }

export default function PSMExam() {
  const [phase, setPhase] = useState("loading");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [flagged, setFlagged] = useState(new Set());
  const [showNav, setShowNav] = useState(false);
  const timerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadState().then(saved => {
      if (saved && saved.phase && saved.phase !== "start" && saved.questions && saved.questions.length > 0) {
        setQuestions(saved.questions); setCurrentQ(saved.currentQ || 0); setAnswers(saved.answers || {}); setTimeLeft(saved.timeLeft != null ? saved.timeLeft : TOTAL_TIME); setFlagged(new Set(saved.flagged || [])); setPhase(saved.phase);
      } else { setPhase("start"); }
    });
  }, []);

  useEffect(() => {
    if (phase === "loading") return;
    if (phase === "start") { clearState(); return; }
    saveState({ phase, questions, currentQ, answers, timeLeft, flagged: Array.from(flagged) });
  }, [phase, questions, currentQ, answers, timeLeft, flagged]);

  const startExam = useCallback(() => { setQuestions(shuffleArray(QUESTIONS)); setCurrentQ(0); setAnswers({}); setTimeLeft(TOTAL_TIME); setFlagged(new Set()); setPhase("exam"); }, []);

  useEffect(() => {
    if (phase === "exam") {
      timerRef.current = setInterval(() => { setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerRef.current); setPhase("review"); return 0; } return prev - 1; }); }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [phase]);

  const finishExam = () => { clearInterval(timerRef.current); setPhase("review"); };

  if (phase === "loading") return (<div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #0a0e1a 0%, #121930 50%, #0d1224 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>Loading...</div></div>);
  if (phase === "start") return <StartScreen onStart={startExam} />;
  if (phase === "review") return <ReviewScreen questions={questions} answers={answers} flagged={Array.from(flagged)} onRetry={startExam} onBackToStart={() => setPhase("start")} />;

  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const isUrgent = timeLeft < 300;
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #0a0e1a 0%, #121930 50%, #0d1224 100%)", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,14,26,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "12px clamp(16px, 4vw, 24px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: isUrgent ? "#f87171" : "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 18, fontVariantNumeric: "tabular-nums", animation: isUrgent ? "pulse 1s infinite" : "none" }}>{formatTime(timeLeft)}</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>{answeredCount}/{questions.length} answered</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowNav(!showNav)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 14px", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Overview</button>
            <button onClick={finishExam} style={{ background: answeredCount === questions.length ? "linear-gradient(135deg, #3182ce, #2563eb)" : "rgba(255,255,255,0.04)", border: answeredCount === questions.length ? "none" : "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 14px", color: answeredCount === questions.length ? "#fff" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Submit</button>
          </div>
        </div>
        <div style={{ height: 2, background: "rgba(255,255,255,0.03)" }}><div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #3182ce, #63b3ed)", transition: "width 0.3s" }} /></div>
      </div>

      {showNav && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowNav(false)}>
          <div style={{ background: "#121930", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, maxWidth: 520, width: "100%", maxHeight: "80vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ color: "#fff", margin: 0, fontSize: 18 }}>Question Navigator</h3>
              <button onClick={() => setShowNav(false)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px 12px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 18 }}>×</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6 }}>
              {questions.map((_, i) => { const ans = answers[i] !== undefined, cur = i === currentQ, fl = flagged.has(i); return (
                <button key={i} onClick={() => { setCurrentQ(i); setShowNav(false); }} style={{ width: "100%", aspectRatio: "1", borderRadius: 8, border: cur ? "2px solid #63b3ed" : "1px solid rgba(255,255,255,0.06)", background: ans ? (fl ? "rgba(251,191,36,0.15)" : "rgba(99,179,237,0.12)") : "rgba(255,255,255,0.02)", color: ans ? "#fff" : "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>{i + 1}{fl && <span style={{ position: "absolute", top: -2, right: -2, fontSize: 8 }}>🚩</span>}</button>); })}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.4)" }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(99,179,237,0.12)", display: "inline-block" }} /> Answered</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.4)" }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "inline-block" }} /> Unanswered</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.4)" }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(251,191,36,0.15)", display: "inline-block" }} /> Flagged</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, padding: "clamp(16px, 4vw, 40px) clamp(16px, 4vw, 24px)", display: "flex", flexDirection: "column", gap: 24 }}>
        <QuestionCard question={q} currentAnswer={answers[currentQ]} onAnswer={(ans) => setAnswers(prev => ({ ...prev, [currentQ]: ans }))} index={currentQ} total={questions.length} />
        <div style={{ maxWidth: 780, width: "100%", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, paddingBottom: 24 }}>
          <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 20px", color: currentQ === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600, cursor: currentQ === 0 ? "not-allowed" : "pointer" }}>← Previous</button>
          <button onClick={() => { const nf = new Set(flagged); if (nf.has(currentQ)) nf.delete(currentQ); else nf.add(currentQ); setFlagged(nf); }} style={{ background: flagged.has(currentQ) ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.02)", border: flagged.has(currentQ) ? "1px solid rgba(251,191,36,0.2)" : "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 16px", color: flagged.has(currentQ) ? "#fbbf24" : "rgba(255,255,255,0.4)", fontSize: 14, cursor: "pointer" }}>🚩 {flagged.has(currentQ) ? "Flagged" : "Flag"}</button>
          <button onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))} disabled={currentQ === questions.length - 1} style={{ background: currentQ === questions.length - 1 ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #3182ce, #2563eb)", border: currentQ === questions.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", borderRadius: 10, padding: "12px 20px", color: currentQ === questions.length - 1 ? "rgba(255,255,255,0.15)" : "#fff", fontSize: 14, fontWeight: 600, cursor: currentQ === questions.length - 1 ? "not-allowed" : "pointer" }}>Next →</button>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </div>
  );
}
