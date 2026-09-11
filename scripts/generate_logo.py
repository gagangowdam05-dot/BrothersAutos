import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_logo():
    size = (512, 512)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    center_x, center_y = 256, 256

    # Draw outer glowing ring/shield
    # Gradient shield background
    shield_pts = [
        (256, 40),   # top center
        (430, 80),   # top right corner
        (410, 310),  # mid right curve
        (256, 470),  # bottom tip
        (102, 310),  # mid left curve
        (82, 80),    # top left corner
    ]

    # Outer metallic border
    draw.polygon(shield_pts, fill=(15, 23, 42, 255), outline=(37, 99, 235, 255), width=10)

    # Inner shield
    inner_shield = [
        (256, 60),
        (410, 96),
        (392, 298),
        (256, 446),
        (120, 298),
        (102, 96),
    ]
    draw.polygon(inner_shield, fill=(11, 19, 43, 255), outline=(59, 130, 246, 220), width=6)

    # Accent sports car aerodynamic roofline / silhouette
    # Windshield and roof
    roof_pts = [
        (150, 290),
        (190, 235),
        (240, 205),
        (280, 205),
        (335, 235),
        (370, 290),
    ]
    for i in range(len(roof_pts) - 1):
        draw.line([roof_pts[i], roof_pts[i+1]], fill=(96, 165, 250, 255), width=8)

    # Beltline / Hood & Trunk line
    draw.line([(130, 290), (385, 290)], fill=(255, 255, 255, 255), width=10)
    
    # Fastback wing spoiler accent
    draw.line([(350, 265), (395, 260)], fill=(249, 115, 22, 255), width=7)

    # Headlight streak (amber/gold & cyan)
    draw.line([(140, 295), (120, 315)], fill=(249, 115, 22, 255), width=6)
    draw.line([(370, 295), (390, 315)], fill=(239, 68, 68, 255), width=6)

    # Center Monogram "BA"
    # Draw stylized "B" and "A"
    # B:
    draw.line([(200, 110), (200, 185)], fill=(255, 255, 255, 255), width=12)
    draw.arc([190, 110, 245, 148], start=270, end=90, fill=(255, 255, 255, 255), width=10)
    draw.arc([190, 145, 248, 185], start=270, end=90, fill=(255, 255, 255, 255), width=10)

    # A:
    draw.line([(260, 185), (290, 110)], fill=(37, 99, 235, 255), width=11)
    draw.line([(290, 110), (320, 185)], fill=(37, 99, 235, 255), width=11)
    draw.line([(272, 160), (308, 160)], fill=(249, 115, 22, 255), width=9)

    # Lower crest text banner "BROTHERS AUTOS"
    # Draw mini stars
    def draw_star(cx, cy, r=10, fill=(249, 115, 22, 255)):
        pts = []
        for i in range(10):
            rad = r if i % 2 == 0 else r * 0.45
            angle = i * math.pi / 5 - math.pi / 2
            pts.append((cx + rad * math.cos(angle), cy + rad * math.sin(angle)))
        draw.polygon(pts, fill=fill)

    draw_star(256, 350, r=14, fill=(249, 115, 22, 255))
    draw_star(210, 360, r=10, fill=(59, 130, 246, 255))
    draw_star(302, 360, r=10, fill=(59, 130, 246, 255))

    # Speed chevron at bottom
    draw.polygon([(256, 395), (280, 420), (256, 412), (232, 420)], fill=(255, 255, 255, 230))

    os.makedirs("public", exist_ok=True)
    out_path = os.path.join("public", "logo.png")
    img.save(out_path, "PNG")
    print(f"Created {out_path} successfully!")

if __name__ == "__main__":
    create_logo()
