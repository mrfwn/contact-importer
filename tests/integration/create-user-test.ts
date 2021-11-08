export const createUserIntegrationTest = (request: any) => {
    describe('Create Valid User', ()=> {
        test('Should be able to create a valid user',async ()=>{
            const resPost = await request.post("/signup").send({
                "username": "test",
                "email": "test@gmail.com",
                "password": "test"
            });
            expect(resPost.status).toBe(200);
        })
    })

}