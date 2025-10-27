import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/index.js";
const app = express();
const port = 3000;
// Prisma Client init
const prisma = new PrismaClient();
app.use(express.json());
// --- GET /elk/emil/locations ---
// s Retrieves all of Emil's reported locations to display his full track on the map.
//Should return an array of lattitude and longitude pairs for quick drawing of the map.
app.get("/elk/emil/locations", async (req: Request, res: Response) => {
    const sightings = await prisma.sighting.findMany();
    const locations = sightings.map(a => [a.latitude,a.longtitude]);
    res.json(locations);
  });

//GET /elk/emil/sighting/latest 
// Gets the most recent reported sighting for Emil. Returns the full Sighting Object (not only the position)
app.get("/elk/emil/sighting/latest", async (req: Request, res: Response) => {
    const recent = await prisma.sighting.findFirst({
        orderBy : {reportedAt:'desc'}
    })
    res.json(recent);
}) 
    
//POST /elk/emil/sightings Creates a new sighting report. The request body would contain the information
//about the sighting the user gives us: location data, a timestamp, and the optional image and detailed notes
//(check the data model for details). You can skip the image-upload for now (just ignore this field in the datamodel)
app.post("/elk/emil/sightings", async (req: Request, res: Response) => {
    const { latitude, longtitude,notes,userId,activity,condition } = req.body;
    const newSighting = await prisma.sighting.create({
        data: {
            latitude,
            longtitude,
            notes,
            userId,
            activity,
            condition
        }
    });
    res.json(newSighting);
});


//GET /elk/emil/sightings/{id} Retrieves a specific sighting report by its unique ID.
app.get("/elk/emil/sightings/:id", async (req: Request, res: Response) => {
    // Konvertiere den URL-Parameter von String zu Nummer
    const id = req.params.id;
    if(!id)
        return res.status(400).json({error: 'ID wird benoetigt'})
    const idInt = parseInt(id);
    if(isNaN(idInt))
        return res.status(400).json({error: 'ID muss eine Zahl sein'})
    const sighting = await prisma.sighting.findUnique({
        where: { id: idInt } //datenbankfeld:variable
    });
    // Prüfe ob eine Sichtung gefunden wurde
    if (sighting) {
        // Wenn gefunden, sende die Sichtung als JSON zurück (Status 200 OK ist Standard)
        res.json(sighting); 
    } else {
        // Wenn keine Sichtung gefunden wurde, sende 404 mit Fehlermeldung
        res.status(404).json({ error: "Sichtung nicht gefunden" });
    }
});

//GET /elk/emil/sightings Retrieves a list of sighting reports
app.get("/elk/emil/sightings", async (req: Request, res: Response) => {
    const sightings = await prisma.sighting.findMany();
    res.json(sightings);
});

//POST /users Registers a new user account.
app.post("/users", async (req: Request, res: Response) => {
    const { username, email,passwordHash,bio } = req.body;
    const newUser = await prisma.user.create({
        data: { 
            username,
            email,
            bio, 
            passwordHash 
        }
    });
    res.json(newUser);
});

//GET /users/{id} Retrieves the profile of the currently authenticated user. We dont authenticate for now. We
//just return the user with the given {id} for now.
app.get("/users/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    if(!id)
        return res.status(400).json({error: 'ID wird benoetigt'})
    const idInt = parseInt(id);
    if(isNaN(idInt))
        return res.status(400).json({error: 'ID muss eine Zahl sein'})
    const user = await prisma.user.findUnique({
        where: { id: idInt } //datenbankfeld:variable
    });
    // Prüfe ob ein User gefunden wurde
    if (user) {
        // Wenn gefunden, sende den User als JSON zurück (Status 200 OK ist Standard)
        res.json(user);
    } else {
        // Wenn kein User gefunden wurde, sende 404 mit Fehlermeldung
        res.status(404).json({ error: "User nicht gefunden" });
    }
});

//PUT /users/{id} Updates the user's profile information (e.g., username, profile picture).
app.put("/users/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    if(!id)
        return res.status(400).json({error: 'ID wird benoetigt'})
    const idInt = parseInt(id);
    if(isNaN(idInt))
        return res.status(400).json({error: 'ID muss eine Zahl sein'})
    const { username,profileImageURL,bio } = req.body;
    try{
        const updatedUser = await prisma.user.update({
            where: { id: idInt },
            data: {
                // Das "bedingten Objekt-Spreading" wird verwendet, um nur die Felder zu aktualisieren,
                // die im Request gesendet wurden. Wenn ein Feld nicht im Request enthalten ist, wird es in der Datenbank nicht geaendert.
                ...(username && {username}),
                ...(profileImageURL && {profileImageUrl: profileImageURL}),
                ...(bio && {bio})
            }
        });
        res.json(updatedUser);
    }catch(error){
        res.status(404).json({ error: "User nicht gefunden" });
    }
});
//GET /users/leaderboard Return a sorted list of users based on the points-attribute in the users-model.
app.get("/users/leaderboard", async (req: Request, res: Response) => {
    const leaderboard = await prisma.user.findMany({
        orderBy: { points: 'desc' }
    });
    res.json(leaderboard);
});
// --- Server starten ---
app.listen(port, () => {
  console.log(`✅ Server läuft auf http://localhost:${port}`);
});



