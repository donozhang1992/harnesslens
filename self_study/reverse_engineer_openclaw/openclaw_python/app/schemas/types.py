from typing import Annotated
from pydantic import StringConstraints

TitleStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
ContentStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]