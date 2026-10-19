from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, Token, UserResponse
from app.services.auth_service import hash_password, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User | None:
    if not credentials:
        return None
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    return db.query(User).filter(User.id == int(user_id)).first()


def require_user(user: User = Depends(get_current_user)) -> User:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in."
        )
    return user


@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
    
    user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name or "Entrepreneur",
        business_name=user_in.business_name or "Solo Venture",
        plan=user_in.plan or "free"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(require_user)):
    return user


@router.post("/demo", response_model=Token)
def demo_login(db: Session = Depends(get_db)):
    """Creates or logs into a ready-to-test Demo Founder account."""
    demo_email = "adityatemp@gmail.com"
    user = db.query(User).filter(User.email == demo_email).first()
    if not user:
        legacy_user = db.query(User).filter(User.email.in_(["founder@hustleai.local", "alex@riveracrafts.com"])).first()
        if legacy_user:
            legacy_user.email = demo_email
            legacy_user.full_name = "Aditya Nath Patel"
            legacy_user.hashed_password = hash_password("Aditya@112")
            user = legacy_user
        else:
            user = User(
                email=demo_email,
                hashed_password=hash_password("Aditya@112"),
                full_name="Aditya Nath Patel",
                business_name="Rivera Handcrafted Co.",
                plan="pro"
            )
            db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.full_name = "Aditya Nath Patel"
        user.hashed_password = hash_password("Aditya@112")
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

