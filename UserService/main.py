from fastapi import FastAPI

from api import auth, users

app = FastAPI(
    title="UserService"
)

app.include_router(auth.router)
app.include_router(users.router)