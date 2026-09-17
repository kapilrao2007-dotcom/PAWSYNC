/**
 * PAWSYNC demo data seeder.
 *
 * Populates the database with realistic, CLEARLY-FLAGGED (isDemo: true) sample
 * data so every page of the app has something real to render: animals up for
 * adoption, rescue cases across every stage of the timeline, an approved
 * donation campaign with confirmed donations, verified volunteers and
 * organizations, and a couple of login accounts for quick testing.
 *
 * Usage:
 *   npm run seed            populate demo data (idempotent-ish - clears demo docs first)
 *   npm run seed:destroy    remove all documents flagged isDemo: true
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const Animal = require('../models/Animal');
const RescueReport = require('../models/RescueReport');
const RescueCase = require('../models/RescueCase');
const Organization = require('../models/Organization');
const Donation = require('../models/Donation');
const Payment = require('../models/Payment');
const { generateCaseId, generateDonationId } = require('../utils/generateIds');

const DEMO_PHOTO = (seed) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=80`;

async function destroy() {
  await connectDB();
  await Promise.all([
    User.deleteMany({ email: /@demo\.pawsync\.org$/ }),
    Volunteer.deleteMany({}),
    Animal.deleteMany({ isDemo: true }),
    RescueReport.deleteMany({ isDemo: true }),
    RescueCase.deleteMany({ isDemo: true }),
    Organization.deleteMany({ isDemo: true }),
    Donation.deleteMany({}),
    Payment.deleteMany({}),
  ]);
  console.log('🧹 Demo data removed.');
  process.exit(0);
}

async function seed() {
  await connectDB();
  console.log('🌱 Seeding PAWSYNC demo data...');

  // --- Clear previous demo data (safe to re-run) ---
  await Promise.all([
    User.deleteMany({ email: /@demo\.pawsync\.org$/ }),
    Volunteer.deleteMany({}),
    Animal.deleteMany({ isDemo: true }),
    RescueReport.deleteMany({ isDemo: true }),
    RescueCase.deleteMany({ isDemo: true }),
    Organization.deleteMany({ isDemo: true }),
    Donation.deleteMany({}),
    Payment.deleteMany({}),
  ]);

  // --- Users ---
  const admin = await User.create({
    name: 'Ananya Rao',
    email: 'admin@demo.pawsync.org',
    password: 'Password123!',
    role: 'admin',
    isVerified: true,
    area: 'Mumbai',
  });

  const orgUser = await User.create({
    name: 'Second Chance Animal Trust',
    email: 'org@demo.pawsync.org',
    password: 'Password123!',
    role: 'organization',
    isVerified: true,
    area: 'Mumbai',
  });

  const volunteerUsers = await User.insertMany([
    {
      name: 'Rehan Sheikh',
      email: 'rehan@demo.pawsync.org',
      password: 'Password123!',
      role: 'volunteer',
      isVerified: true,
      area: 'Andheri, Mumbai',
      contributionPoints: 340,
      level: 'rescue_supporter',
      badges: ['Community Helper', 'Rescue Supporter'],
    },
    {
      name: 'Priya Nair',
      email: 'priya@demo.pawsync.org',
      password: 'Password123!',
      role: 'volunteer',
      isVerified: true,
      area: 'Powai, Mumbai',
      contributionPoints: 620,
      level: 'animal_guardian',
      badges: ['Community Helper', 'Rescue Supporter', 'Animal Guardian'],
    },
    {
      name: 'Karan Mehta',
      email: 'karan@demo.pawsync.org',
      password: 'Password123!',
      role: 'volunteer',
      isVerified: true,
      area: 'Bandra, Mumbai',
      contributionPoints: 120,
      level: 'community_helper',
      badges: ['Community Helper'],
    },
  ]);

  const citizen = await User.create({
    name: 'Yash Kant',
    email: 'citizen@demo.pawsync.org',
    password: 'Password123!',
    role: 'citizen',
    isVerified: true,
    area: 'Mumbai',
  });

  await Volunteer.insertMany(
    volunteerUsers.map((u, i) => ({
      user: u._id,
      area: u.area,
      skills: [['First Aid', 'Transport'], ['Handling', 'Fostering'], ['Awareness', 'Transport']][i],
      availability: ['weekends', 'flexible', 'evenings'][i],
      preferredActivities: [['rescue', 'transport'], ['foster', 'rescue'], ['awareness', 'transport']][i],
      verificationStatus: 'verified',
      location: { type: 'Point', coordinates: [72.8777 + i * 0.01, 19.076 + i * 0.01] },
      stats: {
        communityHours: [42, 96, 18][i],
        casesAssisted: [7, 15, 3][i],
        activeCases: [1, 2, 0][i],
        completedCases: [6, 13, 3][i],
      },
    }))
  );

  // --- Organizations ---
  const orgs = await Organization.insertMany([
    {
      name: 'Second Chance Animal Trust',
      type: 'ngo',
      location: 'Andheri West, Mumbai',
      servicesOffered: ['Emergency Rescue', 'Sheltering', 'Adoption Drives'],
      capacity: 60,
      animalsHosted: 34,
      contactEmail: 'org@demo.pawsync.org',
      verificationStatus: 'verified',
      isDemo: true,
    },
    {
      name: 'Bandra Street Paws Shelter',
      type: 'shelter',
      location: 'Bandra, Mumbai',
      servicesOffered: ['Sheltering', 'Foster Coordination'],
      capacity: 40,
      animalsHosted: 22,
      contactEmail: 'contact@bandrapaws.example.org',
      verificationStatus: 'verified',
      isDemo: true,
    },
    {
      name: 'CarePlus Veterinary Clinic',
      type: 'vet_clinic',
      location: 'Powai, Mumbai',
      servicesOffered: ['Emergency Surgery', 'Vaccination', 'General Checkups'],
      capacity: 0,
      contactEmail: 'careplus@example.org',
      verificationStatus: 'verified',
      isDemo: true,
    },
  ]);

  // --- Adoptable animals (independent of active rescue cases) ---
  const adoptableAnimals = await Animal.insertMany([
    {
      name: 'Simba',
      species: 'dog',
      breed: 'Indie Mix',
      approxAge: '2 years',
      gender: 'male',
      temperament: ['Playful', 'Gentle', 'Good with kids'],
      story: 'Simba was rescued as a stray puppy and has since made a full recovery. He loves long walks and belly rubs.',
      recoveryJourney: 'Treated for malnutrition, fully vaccinated, and now at ideal weight.',
      photos: [DEMO_PHOTO('photo-1543466835-00a7907e9de1')],
      careStatus: 'healthy',
      adoptionStatus: 'available',
      adoptionRequirements: ['Fenced yard preferred', 'Active household'],
      location: 'Andheri West, Mumbai',
      currentShelter: orgs[0]._id,
      isDemo: true,
    },
    {
      name: 'Luna',
      species: 'cat',
      breed: 'Domestic Shorthair',
      approxAge: '1 year',
      gender: 'female',
      temperament: ['Independent', 'Affectionate', 'Quiet'],
      story: 'Luna was found sheltering from the monsoon rains and nursed back to health by our foster network.',
      recoveryJourney: 'Recovered from a minor respiratory infection, spayed and vaccinated.',
      photos: [DEMO_PHOTO('photo-1533738363-b7f9aef128ce')],
      careStatus: 'healthy',
      adoptionStatus: 'available',
      adoptionRequirements: ['Indoor home', 'Calm environment'],
      location: 'Bandra, Mumbai',
      currentShelter: orgs[1]._id,
      isDemo: true,
    },
    {
      name: 'Bruno',
      species: 'dog',
      breed: 'Labrador Mix',
      approxAge: '4 years',
      gender: 'male',
      temperament: ['Loyal', 'Calm', 'Great with other dogs'],
      story: 'Bruno was surrendered by a family that could no longer care for him. He is house-trained and gentle.',
      photos: [DEMO_PHOTO('photo-1552053831-71594a27632d')],
      careStatus: 'healthy',
      adoptionStatus: 'pending',
      adoptionRequirements: ['Experienced dog owner'],
      location: 'Powai, Mumbai',
      currentShelter: orgs[0]._id,
      isDemo: true,
    },
    {
      name: 'Coco',
      species: 'dog',
      breed: 'Indie',
      approxAge: '6 months',
      gender: 'female',
      temperament: ['Energetic', 'Curious'],
      story: 'Coco was one of a litter of five found near a construction site. All puppies have been vaccinated.',
      photos: [DEMO_PHOTO('photo-1601758228041-f3b2795255f1')],
      careStatus: 'healthy',
      adoptionStatus: 'available',
      adoptionRequirements: ['Patience for puppy training'],
      location: 'Andheri West, Mumbai',
      currentShelter: orgs[0]._id,
      isDemo: true,
    },
  ]);

  // --- Rescue Reports + Cases across the full lifecycle ---
  const caseSeeds = [
    {
      name: 'Rocky',
      animalType: 'dog',
      condition: 'injured',
      description: 'Found limping near the highway service road, appears to have a leg injury. Not aggressive but scared.',
      landmark: 'Near Andheri flyover, opposite the petrol pump',
      address: 'Andheri East, Mumbai',
      urgencyIndicators: ['bleeding', 'traffic_risk'],
      finalStage: 'treatment',
      campaign: { isApproved: true, goalAmount: 8000, raisedAmount: 0, treatmentEstimate: 'Fracture treatment, medication and 2-week recovery care' },
      expenses: [
        { label: 'Veterinary treatment', amount: 3500 },
        { label: 'Medicines', amount: 1500 },
        { label: 'Transport', amount: 1000 },
      ],
      donationsToAdd: [500, 750, 1000, 250, 1250, 750, 500, 250],
      assignVolunteer: 0,
    },
    {
      name: 'Motu',
      animalType: 'cow',
      condition: 'trapped',
      description: 'A cow got its leg stuck in a discarded fishing net near the storm drain. Unable to move freely.',
      landmark: 'Behind the vegetable market',
      address: 'Powai, Mumbai',
      urgencyIndicators: ['not_moving'],
      finalStage: 'rescued',
      campaign: { isApproved: false, goalAmount: 0, raisedAmount: 0 },
      assignVolunteer: 1,
    },
    {
      name: 'Whiskers',
      animalType: 'cat',
      condition: 'sick',
      description: 'Kitten appears lethargic and is not eating, found near a residential society entrance.',
      landmark: 'Near Gate 3, Hillside Society',
      address: 'Bandra, Mumbai',
      urgencyIndicators: ['young_animal'],
      finalStage: 'recovered',
      campaign: { isApproved: true, goalAmount: 4000, raisedAmount: 0, treatmentEstimate: 'Deworming, vaccination and nutritional support' },
      expenses: [
        { label: 'Veterinary treatment', amount: 1800 },
        { label: 'Medicines', amount: 900 },
      ],
      donationsToAdd: [500, 500, 1000, 300],
      assignVolunteer: 2,
    },
    {
      name: 'Unnamed',
      animalType: 'bird',
      condition: 'injured',
      description: 'A pigeon was found with an injured wing, unable to fly, near the park bench.',
      landmark: 'Central Park, near the fountain',
      address: 'Andheri West, Mumbai',
      urgencyIndicators: ['none_observed'],
      finalStage: 'verified',
      campaign: { isApproved: false, goalAmount: 0, raisedAmount: 0 },
    },
    {
      name: 'Sheru',
      animalType: 'dog',
      condition: 'abandoned',
      description: 'A dog was left tied up outside a closed shop for over two days, appears dehydrated.',
      landmark: 'Outside the old hardware store',
      address: 'Powai, Mumbai',
      urgencyIndicators: ['weather_exposure'],
      finalStage: 'rescue_in_progress',
      campaign: { isApproved: false, goalAmount: 0, raisedAmount: 0 },
      assignVolunteer: 0,
    },
  ];

  const STAGE_ORDER = [
    'reported',
    'verified',
    'volunteer_assigned',
    'rescue_in_progress',
    'rescued',
    'treatment',
    'foster_shelter',
    'recovered',
    'adoption',
    'closed',
  ];

  for (const seedCase of caseSeeds) {
    const report = await RescueReport.create({
      reporter: citizen._id,
      animalType: seedCase.animalType,
      condition: seedCase.condition,
      description: seedCase.description,
      photos: [DEMO_PHOTO('photo-1544568100-847a948585b9')],
      landmark: seedCase.landmark,
      location: { type: 'Point', coordinates: [72.8777, 19.076], address: seedCase.address },
      urgencyIndicators: seedCase.urgencyIndicators,
      status: 'verified',
      reviewedBy: admin._id,
      reviewedAt: new Date(),
      isDemo: true,
    });

    const animal = await Animal.create({
      name: seedCase.name,
      species: seedCase.animalType,
      photos: report.photos,
      careStatus: seedCase.finalStage === 'recovered' ? 'healthy' : 'in_treatment',
      location: seedCase.address,
      isDemo: true,
    });

    const finalIndex = STAGE_ORDER.indexOf(seedCase.finalStage);
    const timeline = STAGE_ORDER.slice(0, finalIndex + 1).map((stage, i) => ({
      stage,
      note: stage === 'reported' ? 'Reported by community member' : `Case progressed to ${stage.replace(/_/g, ' ')}`,
      at: new Date(Date.now() - (finalIndex - i) * 1000 * 60 * 60 * 6),
    }));

    const rescueCase = await RescueCase.create({
      caseId: generateCaseId(),
      report: report._id,
      animal: animal._id,
      displayName: seedCase.name,
      condition: seedCase.condition,
      animalType: seedCase.animalType,
      photos: report.photos,
      location: report.location,
      status: seedCase.finalStage,
      timeline,
      assignedVolunteer: seedCase.assignVolunteer !== undefined ? volunteerUsers[seedCase.assignVolunteer]._id : undefined,
      campaign: {
        isApproved: seedCase.campaign.isApproved,
        approvedBy: seedCase.campaign.isApproved ? admin._id : undefined,
        approvedAt: seedCase.campaign.isApproved ? new Date() : undefined,
        title: seedCase.campaign.isApproved ? `${seedCase.name}'s Recovery` : undefined,
        goalAmount: seedCase.campaign.goalAmount,
        treatmentEstimate: seedCase.campaign.treatmentEstimate,
        approvedExpenses: (seedCase.expenses || []).map((e) => ({ ...e, approvedBy: admin._id })),
      },
      isDemo: true,
    });

    animal.rescueCase = rescueCase._id;
    await animal.save();
    report.rescueCase = rescueCase._id;
    await report.save();

    // Add confirmed demo donations for cases with an approved campaign
    if (seedCase.donationsToAdd) {
      for (const amount of seedCase.donationsToAdd) {
        const orderId = `order_DEMO${Math.random().toString(36).slice(2, 10)}`;
        const payment = await Payment.create({
          orderId,
          paymentId: `pay_DEMO${Math.random().toString(36).slice(2, 10)}`,
          amount: amount * 100,
          currency: 'INR',
          status: 'captured',
          rescueCase: rescueCase._id,
        });
        await Donation.create({
          donationId: generateDonationId(),
          donorName: 'Anonymous Supporter',
          isAnonymous: true,
          rescueCase: rescueCase._id,
          payment: payment._id,
          amount,
          status: 'confirmed',
          confirmedAt: new Date(),
        });
        rescueCase.campaign.raisedAmount += amount;
      }
      await rescueCase.save();
    }
  }

  console.log('✅ Demo data seeded successfully.\n');
  console.log('Login accounts (all use password: Password123!):');
  console.log('  Admin:        admin@demo.pawsync.org');
  console.log('  Organization: org@demo.pawsync.org');
  console.log('  Volunteer:    rehan@demo.pawsync.org / priya@demo.pawsync.org / karan@demo.pawsync.org');
  console.log('  Citizen:      citizen@demo.pawsync.org\n');

  process.exit(0);
}

const isDestroy = process.argv.includes('--destroy');
(isDestroy ? destroy() : seed()).catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
