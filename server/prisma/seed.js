import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const cities = [
  ['Paris', 'France', 'Europe', 'The City of Light — iconic landmarks, haute cuisine, and romantic boulevards.', 180, 4.9, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'],
  ['Tokyo', 'Japan', 'Asia', "Neon-lit modernity meets ancient tradition in Japan's electric capital.", 150, 4.8, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80'],
  ['Bali', 'Indonesia', 'Asia', 'Tropical paradise with stunning temples, rice terraces, and surf breaks.', 80, 4.7, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'],
  ['New York', 'USA', 'North America', 'The city that never sleeps — world-class art, food, and skyline views.', 250, 4.8, 'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=800&q=80'],
  ['Santorini', 'Greece', 'Europe', "Whitewashed villas, volcanic beaches, and the world's most dramatic sunsets.", 200, 4.9, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80'],
  ['Marrakech', 'Morocco', 'Africa', 'A labyrinth of souks, spices, and stunning Islamic architecture.', 90, 4.6, 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80'],
  ['Cape Town', 'South Africa', 'Africa', 'Where Table Mountain meets two oceans — stunning scenery and vibrant culture.', 120, 4.7, 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80'],
  ['Kyoto', 'Japan', 'Asia', "Japan's ancient imperial capital — thousands of temples, geisha districts, and bamboo groves.", 130, 4.8, 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80'],
  ['Barcelona', 'Spain', 'Europe', "Gaudí's masterpieces, tapas culture, and Mediterranean beach vibes.", 160, 4.7, 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80'],
  ['Queenstown', 'New Zealand', 'Oceania', 'The adventure capital of the world — bungee jumping, skiing, and fjord boat trips.', 170, 4.8, 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80'],
  ['Cappadocia', 'Turkey', 'Asia', 'Fairy chimneys, cave hotels, and sunrise balloon-filled skies.', 110, 4.8, null],
  ['Interlaken', 'Switzerland', 'Europe', 'Alpine adventure hub between two turquoise lakes.', 190, 4.7, null],
  ['Seville', 'Spain', 'Europe', 'Flamenco, tapas, and Moorish palaces in Andalusia.', 120, 4.7, null],
  ['Manaus', 'Brazil', 'South America', 'Gateway to the Amazon rainforest.', 100, 4.4, null],
  ['Tromsø', 'Norway', 'Europe', 'Arctic gateway famous for northern lights and fjords.', 210, 4.6, null],
  ['Agra', 'India', 'Asia', 'Home of the Taj Mahal and Mughal heritage.', 60, 4.7, null],
  ['Cairns', 'Australia', 'Oceania', 'Diving and reef adventures on the Great Barrier Reef.', 140, 4.6, null],
  ['Merzouga', 'Morocco', 'Africa', 'Saharan dunes, camel treks, and desert camps.', 70, 4.5, null],
  ['Rome', 'Italy', 'Europe', 'The Eternal City — ancient wonders and incredible food.', 160, 4.8, null],
  ['Bordeaux', 'France', 'Europe', 'World-famous wine country with elegant architecture.', 150, 4.6, null],
];

// name, category, cityKey, cost, durationMins, difficulty, description, image
const activities = [
  ['Hot Air Balloon Ride', 'Adventure', 'Cappadocia|Turkey', 180, 180, 'Easy', 'Float above fairy chimneys and volcanic landscapes at sunrise for an unforgettable experience.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'],
  ['Sushi Making Class', 'Food & Culture', 'Tokyo|Japan', 95, 120, 'Easy', 'Learn to roll perfect sushi from a master chef in a traditional Tokyo kitchen.', 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&q=80'],
  ['Paragliding over Alps', 'Adventure', 'Interlaken|Switzerland', 220, 90, 'Moderate', 'Tandem paragliding with stunning views of snow-capped peaks and turquoise lakes.', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80'],
  ['Flamenco Dance Show', 'Culture', 'Seville|Spain', 65, 90, 'Easy', 'Authentic flamenco performance with live guitar in an intimate tablao setting.', 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80'],
  ['Amazon Jungle Trek', 'Nature', 'Manaus|Brazil', 450, 4320, 'Challenging', 'Multi-day guided trek through the Amazon rainforest with expert naturalist guides.', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80'],
  ['Northern Lights Viewing', 'Nature', 'Tromsø|Norway', 160, 240, 'Easy', 'Chase the aurora borealis with a professional guide on a private snowmobile tour.', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80'],
  ['Taj Mahal Sunrise Visit', 'Heritage', 'Agra|India', 85, 180, 'Easy', 'Private guided tour of the Taj Mahal at sunrise before the crowds arrive.', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80'],
  ['Scuba Diving Great Barrier Reef', 'Water Sports', 'Cairns|Australia', 195, 360, 'Moderate', "Explore the world's largest coral reef system with certified PADI instructors.", 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&q=80'],
  ['Sahara Desert Camel Trek', 'Adventure', 'Merzouga|Morocco', 250, 2880, 'Moderate', 'Overnight camel trek into the Erg Chebbi dunes with desert camp under the stars.', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80'],
  ['Colosseum Underground Tour', 'Heritage', 'Rome|Italy', 75, 120, 'Easy', 'Exclusive access to the underground chambers where gladiators once prepared for battle.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80'],
  ['Vineyard Wine Tasting Tour', 'Food & Culture', 'Bordeaux|France', 130, 300, 'Easy', 'Visit three prestigious châteaux with sommelier-guided tastings and cellar tours.', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80'],
  ['Bungee Jump - Kawarau Bridge', 'Adventure', 'Queenstown|New Zealand', 165, 60, 'Challenging', 'Leap from the birthplace of commercial bungee jumping — 43 meters above a turquoise river.', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80'],
  ['Eiffel Tower Skip-the-line', 'Heritage', 'Paris|France', 30, 120, 'Easy', 'Skip the queues and ascend the Iron Lady for panoramic views of Paris.', null],
  ['Louvre Museum', 'Culture', 'Paris|France', 22, 180, 'Easy', 'Home of the Mona Lisa — the largest art museum on the planet.', null],
  ['Montmartre Walking Tour', 'Culture', 'Paris|France', 25, 120, 'Easy', 'Wander cobblestone lanes, artist squares, and Sacré-Cœur views.', null],
  ['Cooking Class - French Cuisine', 'Food & Culture', 'Paris|France', 95, 180, 'Easy', 'Master classic French techniques with a local chef.', null],
  ['Fushimi Inari Shrine', 'Heritage', 'Kyoto|Japan', 0, 120, 'Easy', 'Hike through thousands of vermillion torii gates on the sacred mountain.', null],
  ['Arashiyama Bamboo Grove', 'Nature', 'Kyoto|Japan', 0, 90, 'Easy', 'Stalks of towering bamboo swaying in the wind — pure serenity.', null],
  ['Tea Ceremony Experience', 'Culture', 'Kyoto|Japan', 45, 90, 'Easy', 'Participate in a traditional Japanese tea ceremony in a machiya townhouse.', null],
  ['Ubud Rice Terraces Walk', 'Nature', 'Bali|Indonesia', 5, 120, 'Easy', 'Sunrise walk through the emerald Tegallalang rice terraces.', null],
  ['Monkey Forest Sanctuary', 'Nature', 'Bali|Indonesia', 8, 90, 'Easy', 'Sacred forest home to hundreds of playful long-tailed macaques.', null],
  ['Central Park Bike Tour', 'Sports', 'New York|USA', 35, 120, 'Moderate', 'Pedal through the most famous urban park in the world.', null],
  ['Broadway Show Night', 'Entertainment', 'New York|USA', 180, 180, 'Easy', 'Catch a world-class Broadway production in the Theater District.', null],
  ['Jemaa el-Fnaa Food Tour', 'Food & Culture', 'Marrakech|Morocco', 40, 180, 'Easy', 'Eat your way through the legendary medina square after dark.', null],
];

const d = (str) => new Date(str);

async function findActivity(name) {
  const a = await prisma.activity.findFirst({ where: { name } });
  return a ? { id: a.id, cost: a.cost } : null;
}

// [name, description, startDate, endDate, status, budget, currency, isPublic, shareSlug|null, stops[]]
// stop: [title, cityName|country, arrival, departure, budget, items[[activityName|null, titleOverride, date, time]]]
async function createTrip(userId, cityIds, [name, description, startDate, endDate, status, totalBudget, currency, isPublic, shareSlug, stops]) {
  await prisma.trip.create({
    data: {
      userId,
      name,
      description,
      startDate: d(startDate),
      endDate: d(endDate),
      status,
      totalBudget,
      currency,
      isPublic,
      shareSlug,
      stops: {
        create: await Promise.all(stops.map(async ([title, cityKey, arrival, departure, budget, items], idx) => ({
          title,
          cityId: cityIds[cityKey],
          arrivalDate: d(arrival),
          departureDate: d(departure),
          budget,
          sortOrder: idx,
          items: {
            create: await Promise.all(items.map(async ([activityName, titleOverride, date, time]) => {
              const a = activityName ? await findActivity(activityName) : null;
              return {
                activityId: a?.id || null,
                title: titleOverride || activityName || 'Untitled',
                date: d(date),
                time,
                cost: a?.cost ?? 0,
                category: 'activity',
              };
            })),
          },
        }))),
      },
    },
  });
}

async function main() {
  const cityIds = {};
  for (const [name, country, region, description, costIndex, popularity, imageUrl] of cities) {
    const city = await prisma.city.upsert({
      where: { name_country: { name, country } },
      update: {},
      create: { name, country, region, description, costIndex, popularity, imageUrl },
    });
    cityIds[`${name}|${country}`] = city.id;
  }
  console.log(`Seeded ${cities.length} cities`);

  for (const [name, category, cityKey, cost, durationMins, difficulty, description, imageUrl] of activities) {
    const exists = await prisma.activity.findFirst({ where: { name, cityId: cityIds[cityKey] } });
    if (!exists) {
      await prisma.activity.create({
        data: { name, category, cityId: cityIds[cityKey], cost, durationMins, difficulty, description, imageUrl },
      });
    }
  }
  console.log(`Seeded ${activities.length} activities`);

  // [email, name, bio, role, trips[]]
  const users = [
    ['demo@globetrotter.app', 'Demo Traveler', 'Exploring the world one itinerary at a time.', 'admin', [
      ['Paris Getaway', 'A romantic 5-day escape to the City of Light, exploring museums, cafes, and iconic landmarks.', '2026-09-15', '2026-09-20', 'completed', 2400, 'USD', true, 'paris-getaway-2026',
        [['Flight & Arrival', 'Paris|France', '2026-09-15', '2026-09-17', 800, [
          ['CDG Airport Transfer', null, '2026-09-15', '08:00'],
          ['Hotel Check-in - Le Marais', null, '2026-09-15', '14:00'],
          ['Eiffel Tower Skip-the-line', null, '2026-09-16', '10:00'],
          ['Louvre Museum', null, '2026-09-16', '14:00'],
          ['Montmartre Walking Tour', null, '2026-09-17', '09:00']]]]],
      ['Kyoto Retreat', 'A 4-day journey through ancient temples, bamboo forests, and traditional tea ceremonies.', '2026-10-11', '2026-10-14', 'upcoming', 1800, 'USD', false, null,
        [['Arrival & Fushimi Inari', 'Kyoto|Japan', '2026-10-11', '2026-10-13', 400, [
          ['Shinkansen from Tokyo', null, '2026-10-11', '09:00'],
          ['Fushimi Inari Shrine', null, '2026-10-11', '14:00'],
          ['Nishiki Market Dinner', null, '2026-10-11', '19:00'],
          ['Arashiyama Bamboo Grove', null, '2026-10-12', '08:00'],
          ['Tea Ceremony Experience', null, '2026-10-12', '15:00']]]]],
      ['Bali Beach Escape', 'Eight days of beach, temples, rice terraces, and spiritual renewal in the Island of the Gods.', '2026-11-20', '2026-11-28', 'upcoming', 2000, 'USD', false, null,
        [['Ubud Highlands', 'Bali|Indonesia', '2026-11-20', '2026-11-23', 800, [
          ['Ubud Rice Terraces Walk', null, '2026-11-20', '07:00'],
          ['Monkey Forest Sanctuary', null, '2026-11-21', '15:00']]]]],
      ['NYC Winter Break', "A week-long urban adventure exploring Manhattan's neighborhoods, world-class museums, and Broadway shows.", '2026-08-01', '2026-08-07', 'ongoing', 3500, 'USD', false, null,
        [['Midtown & Central Park', 'New York|USA', '2026-08-01', '2026-08-03', 600, [
          ['Central Park Bike Tour', null, '2026-08-01', '14:00'],
          ['Broadway Show Night', null, '2026-08-01', '20:00']]]]],
      ['Santorini Honeymoon', 'Seven magical days of whitewashed villas, volcanic black beaches, and spectacular sunsets.', '2026-06-10', '2026-06-17', 'completed', 5000, 'USD', true, 'santorini-honeymoon',
        [['Oia & Sunset Views', 'Santorini|Greece', '2026-06-10', '2026-06-14', 2000, []]]],
      ['Morocco Souk Adventure', 'Five days of medina exploration, desert day trips, and authentic Moroccan cuisine.', '2026-12-05', '2026-12-10', 'planning', 1500, 'USD', false, null, []],
    ]],
    ['aria.winters@example.com', 'Aria Winters', 'Solo backpacker. 23 countries and counting. Slow travel advocate.', 'user', [
      ['Southeast Asia Loop', 'Six weeks across Thailand, Vietnam, and Indonesia on a backpacker budget.', '2027-01-05', '2027-02-16', 'planning', 2800, 'USD', true, 'sea-backpacker-loop',
        [['Bangkok Kickoff', 'Bali|Indonesia', '2027-01-05', '2027-01-09', 350, [
          ['Ubud Rice Terraces Walk', null, '2027-01-06', '07:00'],
          ['Monkey Forest Sanctuary', null, '2027-01-07', '10:00']]]]],
      ['Japan Rail Pass Marathon', 'Two weeks riding the Shinkansen from Tokyo to Kyoto with a JR Pass.', '2026-04-02', '2026-04-16', 'completed', 3200, 'USD', false, null,
        [['Tokyo Days', 'Tokyo|Japan', '2026-04-02', '2026-04-06', 900, [
          ['Sushi Making Class', null, '2026-04-03', '11:00'],
          ['Neon District Night Walk', 'Evening stroll through Shibuya and Shinjuku.', '2026-04-03', '19:00']]]]],
    ]],
    ['marco.bellini@example.com', 'Marco Bellini', 'Food-first traveler. If there is no market tour on the plan, I am not going.', 'user', [
      ['Iberian Tapas Trail', 'Barcelona to Seville eating our way through Spain.', '2026-09-03', '2026-09-12', 'upcoming', 2600, 'EUR', true, 'iberian-tapas-trail',
        [['Barcelona Bite', 'Barcelona|Spain', '2026-09-03', '2026-09-06', 700, [
          ['Gaudí Architecture Walk', 'Sagrada Familia, Park Güell, and Casa Batlló in one morning.', '2026-09-04', '09:30'],
          ['Tapas Crawl - El Born', 'Four bars, twelve plates, zero regrets.', '2026-09-04', '20:00']]],
         ['Seville Nights', 'Seville|Spain', '2026-09-06', '2026-09-10', 650, [
          ['Flamenco Dance Show', null, '2026-09-07', '21:00']]]]],
      ['Wine Country Weekend', 'A quick Bordeaux escape with vineyard tours and cellar dinners.', '2026-05-15', '2026-05-18', 'completed', 950, 'EUR', false, null,
        [['Vineyard Circuit', 'Bordeaux|France', '2026-05-15', '2026-05-18', 500, [
          ['Vineyard Wine Tasting Tour', null, '2026-05-16', '10:00']]]]],
    ]],
    ['priya.sharma@example.com', 'Priya Sharma', 'Adventure junkie from Mumbai. Mountains over beaches, always.', 'user', [
      ['Swiss Alps Adventure', 'Paragliding, hiking, and lake dips across Interlaken.', '2026-07-10', '2026-07-18', 'completed', 4200, 'CHF', true, 'swiss-alps-adventure',
        [['Interlaken Base', 'Interlaken|Switzerland', '2026-07-10', '2026-07-15', 1800, [
          ['Paragliding over Alps', null, '2026-07-11', '09:00'],
          ['Lake Thun Kayak Morning', 'Peaceful paddle beneath the peaks before the wind picks up.', '2026-07-12', '07:30']]]]],
      ['Rajasthan Heritage Circuit', 'Jaipur, Jodhpur, Udaipur — forts, palaces, and desert sunsets.', '2026-10-02', '2026-10-11', 'upcoming', 1600, 'INR', false, null,
        [['Agra Stopover', 'Agra|India', '2026-10-02', '2026-10-04', 300, [
          ['Taj Mahal Sunrise Visit', null, '2026-10-03', '05:45']]]]],
      ['Queenstown Adrenaline Week', 'Bungee, skydive, jetboat — the full adrenaline menu.', '2027-02-08', '2027-02-15', 'planning', 5200, 'NZD', false, null,
        [['Adventure Central', 'Queenstown|New Zealand', '2027-02-08', '2027-02-14', 2500, [
          ['Bungee Jump - Kawarau Bridge', null, '2027-02-09', '10:00']]]]],
    ]],
    ['tom.okafor@example.com', 'Tom Okafor', 'Photographer chasing light. Currently documenting desert landscapes.', 'user', [
      ['Sahara Expedition', 'Marrakech to Merzouga — dunes, stars, and silence.', '2026-12-28', '2027-01-04', 'planning', 2100, 'USD', true, 'sahara-expedition',
        [['Marrakech Medina', 'Marrakech|Morocco', '2026-12-28', '2026-12-31', 450, [
          ['Jemaa el-Fnaa Food Tour', null, '2026-12-29', '18:30']]],
         ['Erg Chebbi Dunes', 'Merzouga|Morocco', '2026-12-31', '2027-01-03', 700, [
          ['Sahara Desert Camel Trek', null, '2026-12-31', '15:00']]]]],
      ['Reykjavik Aurora Hunt', null, '2026-11-10', '2026-11-15', 'planning', 1900, 'USD', false, null,
        [['Golden Circle', 'Tromsø|Norway', '2026-11-10', '2026-11-14', 600, [
          ['Northern Lights Viewing', null, '2026-11-11', '21:00']]]]],
    ]],
    ['elena.petrova@example.com', 'Elena Petrova', 'History teacher. I plan trips around ruins and museums.', 'user', [
      ['Classical Italy Grand Tour', 'Rome, Florence, Venice — ten days of ancient history and Renaissance art.', '2026-09-20', '2026-09-30', 'upcoming', 3800, 'EUR', true, 'classical-italy-tour',
        [['Rome Antics', 'Rome|Italy', '2026-09-20', '2026-09-25', 1200, [
          ['Colosseum Underground Tour', null, '2026-09-21', '09:00'],
          ['Forum & Palatine Deep Dive', 'Three hours among the ruins of the Roman Forum.', '2026-09-22', '10:00']]]]],
      ['Greek Islands Ferry Hop', 'Athens, Santorini, Naxos via ferry.', '2026-05-01', '2026-05-12', 'completed', 3100, 'EUR', false, null,
        [['Caldera Views', 'Santorini|Greece', '2026-05-04', '2026-05-08', 1400, []]]],
    ]],
    ['jack.thompson@example.com', 'Jack Thompson', 'Diver. Reef checklist: Great Barrier done, Red Sea next.', 'user', [
      ['Barrier Reef Liveaboard', 'Four nights on a dive boat off Cairns.', '2026-08-20', '2026-08-26', 'ongoing', 3400, 'AUD', true, 'barrier-reef-liveaboard',
        [['Cairns Departure', 'Cairns|Australia', '2026-08-20', '2026-08-25', 2200, [
          ['Scuba Diving Great Barrier Reef', null, '2026-08-21', '08:00'],
          ['Night Dive - Ribbon Reefs', 'Sharks and bioluminescence after dark.', '2026-08-22', '19:00']]]]],
      ['Cappadocia Balloon Festival', 'Fairy chimneys and fifty balloons at dawn.', '2026-07-05', '2026-07-09', 'completed', 1500, 'TRY', false, null,
        [['Göreme Valley', 'Cappadocia|Turkey', '2026-07-05', '2026-07-09', 600, [
          ['Hot Air Balloon Ride', null, '2026-07-06', '05:00']]]]],
    ]],
    ['sofia.mendes@example.com', 'Sofia Mendes', 'Remote designer. Trips must have good wifi and better coffee.', 'user', [
      ['Lisbon Digital Nomad Month', 'Working from Lisbon with weekend escapes.', '2026-06-01', '2026-06-30', 'completed', 2900, 'EUR', false, null, []],
      ['Morocco Remote Retreat', 'A month split between Marrakech and the coast.', '2027-03-01', '2027-03-28', 'planning', 2400, 'USD', true, 'morocco-remote-retreat',
        [['Marrakech Settle-in', 'Marrakech|Morocco', '2027-03-01', '2027-03-08', 500, [
          ['Jemaa el-Fnaa Food Tour', null, '2027-03-02', '19:00']]]]],
    ]],
  ];

  let userCount = 0;
  let tripCount = 0;
  for (const [email, name, bio, role, tripDefs] of users) {
    const passwordHash = await bcrypt.hash('demo1234', 10);
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, bio, role },
      create: { email, passwordHash, name, bio, role },
    });
    userCount++;

    const existingTrips = await prisma.trip.count({ where: { userId: user.id } });
    if (existingTrips > 0) {
      console.log(`Trips already seeded for ${email}, skipping`);
      continue;
    }
    for (const tripDef of tripDefs) {
      await createTrip(user.id, cityIds, tripDef);
      tripCount++;
    }
  }

  console.log(`Seeded ${userCount} users, ${tripCount} new trips (${cities.length} cities, ${activities.length} activities)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
