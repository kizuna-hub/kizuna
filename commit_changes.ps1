function Commit-Path {
    param(
        [string]$Path,
        [string]$Message
    )
    git add $Path
    $diff = git diff --cached --name-only
    if ($diff.Length -gt 0) {
        git commit -m $Message
    }
}

Commit-Path "components/investor" "refactor: remove legacy investor components"
Commit-Path "components/mentor" "refactor: remove legacy mentor components"
Commit-Path "components/pricing components/profile-setup components/project-profile components/project" "refactor: remove legacy project and profile components"
Commit-Path "components/submit-project" "refactor: remove legacy submit-project components"
Commit-Path "features/founder/founder-dashboard/main" "refactor: remove legacy founder discover dashboard"
Commit-Path "features/founder/founder-dashboard/platform" "refactor: remove legacy founder platform dashboard"
Commit-Path "features/founder/founder-dashboard/public" "refactor: remove legacy founder public dashboard"
Commit-Path "features/founder/founder-dashboard" "refactor: remove remaining legacy founder dashboard modules"
Commit-Path "features/founder/founder-workspace/ai-pitch-deck" "refactor: remove legacy ai pitch deck feature"
Commit-Path "features/founder/founder-workspace/data-room" "refactor: remove legacy data room feature"
Commit-Path "features/founder/founder-workspace" "refactor: remove other legacy founder workspace modules"
Commit-Path "features/investor" "refactor: remove legacy investor features"
Commit-Path "features/mentor/mentor-profile" "refactor: remove legacy mentor profile screen"
Commit-Path "features/profile-setup lib/context/ProjectContext.tsx" "refactor: remove legacy profile setup and project context"
Commit-Path "middleware.ts proxy.ts" "chore: rename middleware to proxy for Next.js compatibility"
Commit-Path "app/globals.css components/ui/button.tsx" "fix: resolve layout shift and improve button text color contrast"
Commit-Path "features/mentor/workspace" "feat(mentor): add tags to request cards and update UI layout"
Commit-Path "next-env.d.ts" "chore: update next-env.d.ts"

git add .
$diff = git diff --cached --name-only
if ($diff.Length -gt 0) {
    git commit -m "chore: clean up remaining files"
}

git push
