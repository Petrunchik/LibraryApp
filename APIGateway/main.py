from contextlib import asynccontextmanager
from urllib.parse import urlparse

import httpx
from fastapi import FastAPI, Request, Response


from settings import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.http_client = httpx.AsyncClient()
    try:
        yield
    finally:
        await app.state.http_client.aclose()


app = FastAPI(
    title="Library App",
    lifespan=lifespan
)


def _build_routes():
    sett = get_settings()
    return {
        "auth":         sett.user_service,
        "users":        sett.user_service,
        "reservations": sett.reservation_service,
        "payments":     sett.payment_service,
        "library":      sett.library_service,
        "fines":        sett.fine_service,
    }


def get_target_url(path: str) -> str | None:
    if not path:
        return None

    parsed_path = urlparse(path).path
    target = parsed_path.strip("/").split("/", 1)[0]
    
    if not target:
        return None

    return _build_routes().get(target)


@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def proxy_request(request: Request, path: str):
    service_url = get_target_url(path=path)

    if not service_url:
        return Response(content="Not Found", status_code=404)

    target_url = f"{service_url}/{path}"
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None)

    body = await request.body()
    try:
        proxied_req = app.state.http_client.build_request(
            method=request.method,
            url=target_url,
            headers=headers,
            params=request.query_params,
            content=body
        )

        response = await app.state.http_client.send(proxied_req)
    except httpx.RequestError as ex:
        return Response(
            content="Service Unavailable",
            status_code=503,
        )
    response_headers = dict(response.headers)
    response_headers.pop("content-length", None)
    response_headers.pop("transfer-encoding", None)

    return Response(
        content=response.content,
        status_code=response.status_code,
        headers=response_headers
    )